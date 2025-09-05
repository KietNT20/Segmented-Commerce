import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptProvider } from '../auth/providers/bcrypt.provider';
import { HashingProvider } from '../auth/providers/hashing.provider';
import { Customer } from '../customers/entities/customer.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Customer])],
    providers: [
        UsersResolver,
        UsersService,
        {
            provide: HashingProvider,
            useClass: BcryptProvider,
        },
    ],
    exports: [UsersService],
})
export class UsersModule {}
