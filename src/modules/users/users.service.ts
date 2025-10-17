import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtDecode } from 'jwt-decode';
import { In, Repository } from 'typeorm';
import { HashingProvider } from '../auth/providers/hashing.provider';
import { Customer } from '../customers/entities/customer.entity';
import {
    Paginated,
    SortOrder,
} from '../pagination/interface/paginated.interface';
import { Role } from '../roles/entities/role.entity';
import { CreateUserInput } from './dto/create-user.input';
import { QueryUserInput } from './dto/query-user.input';
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

        const existingUser = await this.usersRepository.findOne({
            where: [{ email }, ...(phone ? [{ phone }] : [])],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('Email already exists');
            }
            if (existingUser.phone === phone) {
                throw new ConflictException('Phone number already exists');
            }
        }

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
        });

        return this.usersRepository.save(newUser);
    }

    async findAll(queryUserInput: QueryUserInput): Promise<Paginated<User>> {
        const {
            offset = 1,
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
            .addSelect([
                'user.id',
                'user.email',
                'user.firstName',
                'user.lastName',
            ])
            .orderBy(`user.${orderField}`, sortOrder)
            .skip((offset - 1) * limit)
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
        return this.usersRepository.findOneBy({ id });
    }

    async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

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
        const user = await this.usersRepository.findOneBy({ email });

        if (!user) {
            throw new NotFoundException(
                `Account with email ${email} not found`,
            );
        }

        return user;
    }

    async updateRefreshToken(id: string, refreshToken: string) {
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
}
