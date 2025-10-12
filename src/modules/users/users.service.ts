import {
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
        const existingUserEmail = await this.usersRepository.findOneBy({
            email: createUserInput.email,
        });

        if (existingUserEmail) {
            throw new ConflictException('Email already exists');
        }

        if (createUserInput.phone) {
            const existingUserPhone = await this.usersRepository.findOneBy({
                phone: createUserInput.phone,
            });

            if (existingUserPhone) {
                throw new ConflictException('Phone number already exists');
            }
        }

        if (createUserInput.customerId) {
            const customer = await this.customersRepository.findOneBy({
                id: createUserInput.customerId,
            });

            if (!customer) {
                throw new NotFoundException('Customer not found');
            }
        }

        if (createUserInput.customerId) {
            const customer = await this.customersRepository.findOneBy({
                id: createUserInput.customerId,
            });

            if (!customer) {
                throw new NotFoundException('Customer not found');
            }
        }

        const roles = await this.rolesRepository.findBy({
            id: In(createUserInput.userRoleIds),
        });

        if (roles.length !== createUserInput.userRoleIds.length) {
            throw new NotFoundException('One or more roles not found');
        }

        const hashedPassword = await this.hashingProvider.hashPassword(
            createUserInput.password,
        );

        const createdUser = this.usersRepository.create({
            ...createUserInput,
            password: hashedPassword,
        });

        return this.usersRepository.save(createdUser);
    }

    async findAll(queryUserInput: QueryUserInput): Promise<Paginated<User>> {
        const {
            offset = 1,
            limit = 10,
            sortOrder = SortOrder.DESC,
            email,
            phone,
            roleIds,
        } = queryUserInput;

        const query = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.customer', 'customer');

        const needJoinRole = roleIds && roleIds.length > 0;

        if (needJoinRole) {
            query.innerJoin('user.userRoles', 'userRole');
            query.innerJoin('userRole.role', 'role');
        }

        if (email) {
            query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
        }

        if (phone) {
            query.andWhere('user.phone LIKE :phone', { phone: `%${phone}%` });
        }

        if (roleIds && roleIds.length > 0) {
            query.andWhere('role.id IN (:...roleIds)', { roleIds });
        }

        const total = await query.getCount();

        const users = await query
            .addSelect([
                'user.id',
                'user.email',
                'user.firstName',
                'user.lastName',
            ])
            .orderBy('user.createdAt', sortOrder)
            .skip((offset - 1) * limit)
            .take(limit)
            .getMany();

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
