import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtDecode } from 'jwt-decode';
import { Repository } from 'typeorm';
import { HashingProvider } from '../auth/providers/hashing.provider';
import { Customer } from '../customers/entities/customer.entity';
import {
    Paginated,
    SortOrder,
} from '../pagination/interface/paginated.interface';
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
            offset = 0,
            limit = 10,
            sortOrder = SortOrder.DESC,
        } = queryUserInput;

        const [users, total] = await this.usersRepository.findAndCount({
            where: {
                email: queryUserInput.email,
                phone: queryUserInput.phone,
                role: queryUserInput.role,
            },
            skip: (offset - 1) * limit,
            take: limit,
            order: {
                createdAt: sortOrder,
            },
            relations: {
                customer: true,
            },
        });

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
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateRefreshToken(id: string, refreshToken: string) {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('User not found');
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
