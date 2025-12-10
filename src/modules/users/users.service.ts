import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtDecode } from 'jwt-decode';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { HashingProvider } from '../auth/providers/hashing.provider';
import { Customer } from '../customers/entities/customer.entity';
import { SortOrder } from '../pagination/interface/paginated.interface';
import { Role } from '../roles/entities/role.entity';
import { CreateUserInput } from './dto/create-user.input';
import { PaginatedUser, QueryUserInput } from './dto/query-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        private readonly hashingProvider: HashingProvider,
    ) {}

    async create(createUserInput: CreateUserInput): Promise<User> {
        const { email, phone, customerId, userRoleIds, password } =
            createUserInput;

        await this.checkUserExists(email, phone ?? '');

        if (customerId) {
            const customer = await this.customersRepository.findOneBy({
                id: customerId,
            });
            if (!customer) throw new NotFoundException('Customer not found');
        }

        if (!userRoleIds?.length) {
            throw new BadRequestException('User must have at least one role');
        }

        const roles = await this.rolesRepository.findBy({
            id: In(userRoleIds),
        });

        if (roles.length !== userRoleIds.length) {
            throw new NotFoundException('One or more roles not found');
        }

        const hashedPassword =
            await this.hashingProvider.hashPassword(password);

        const newUser = this.usersRepository.create({
            ...createUserInput,
            password: hashedPassword,
            userRoles: roles,
        });

        return this.usersRepository.save(newUser);
    }

    async findAll(queryUserInput: QueryUserInput): Promise<PaginatedUser> {
        const {
            offset = 0,
            limit = 10,
            sortOrder = SortOrder.DESC,
            email,
            phone,
            roleIds,
            firstName,
            lastName,
            orderBy = 'createdAt',
        } = queryUserInput;

        const validOrderFields = [
            'email',
            'firstName',
            'lastName',
            'createdAt',
        ];

        const orderField = validOrderFields.includes(orderBy)
            ? orderBy
            : 'createdAt';

        const query = this.usersRepository.createQueryBuilder('user');

        query.leftJoin('user.customer', 'customer');
        query.leftJoinAndSelect('user.userRoles', 'userRole');

        if (roleIds?.length) {
            query
                .innerJoin('user.userRoles', 'userRole')
                .innerJoin(
                    'userRole.role',
                    'role',
                    'role.id IN (:...roleIds)',
                    { roleIds },
                );
        }

        if (email) {
            query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
        }

        if (firstName) {
            query.andWhere('user.firstName ILIKE :firstName', {
                firstName: `%${firstName}%`,
            });
        }

        if (lastName) {
            query.andWhere('user.lastName ILIKE :lastName', {
                lastName: `%${lastName}%`,
            });
        }

        if (phone) {
            query.andWhere('user.phone LIKE :phone', { phone: `%${phone}%` });
        }

        const [users, total] = await query
            .orderBy(`user.${orderField}`, sortOrder)
            .skip(offset * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: users,
            meta: {
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                currentPage: offset,
                itemsPerPage: limit,
            },
        };
    }

    findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: {
                userRoles: {
                    permissions: true,
                },
            },
        });
    }

    async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.checkUserExists(
            updateUserInput.email ?? user.email,
            updateUserInput.phone ?? user.phone ?? '',
            id,
        );

        const updatedUser = this.usersRepository.merge(user, updateUserInput);

        return this.usersRepository.save(updatedUser);
    }

    async remove(id: string): Promise<void> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.usersRepository.remove(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({
            where: { email },
            relations: {
                userRoles: true,
            },
        });

        return user;
    }

    async checkUserExists(
        email: string,
        phone: string,
        excludeId?: string,
    ): Promise<void> {
        const whereConditions: FindOptionsWhere<User>[] = [{ email }];

        if (phone) {
            whereConditions.push({ phone });
        }

        const existingUser = await this.usersRepository.findOne({
            where: whereConditions.map((condition) => ({
                ...condition,
                ...(excludeId && { id: Not(excludeId) }),
            })),
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('Email already exists');
            }
            if (existingUser.phone === phone) {
                throw new ConflictException('Phone number already exists');
            }
        }
    }

    async updateRefreshToken(
        id: string,
        refreshToken: string,
    ): Promise<User | null> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        const hashedRefreshToken =
            await this.hashingProvider.hashPassword(refreshToken);

        const updatedUser = this.usersRepository.merge(user, {
            refreshToken: hashedRefreshToken,
        });

        return this.usersRepository.save(updatedUser);
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        const decodedRefreshToken = jwtDecode(refreshToken);

        const user = await this.usersRepository.findOneBy({
            id: decodedRefreshToken.sub as string,
        });

        if (!user) {
            throw new ForbiddenException('Access Denied');
        }

        return user;
    }

    /**
     * Kiểm tra refreshToken có khớp với token đã lưu trong database không
     */
    async validateRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<boolean> {
        const user = await this.usersRepository.findOneBy({ id: userId });

        if (!user || !user.refreshToken) {
            return false;
        }

        // So sánh refreshToken đã hash với token đã lưu
        const isMatch = await this.hashingProvider.comparePassword(
            refreshToken,
            user.refreshToken,
        );

        return isMatch;
    }
}
