import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from './user.entity';
import { Repository, In, Like } from "typeorm";
import { CreateUserDto } from './user.dto';
import { plainToInstance } from "class-transformer";
import { RegisterDto } from 'src/auth/auth.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ) { }

    async create(dataUserNew: RegisterDto) {
        const newUser = await this.usersRepository.create(dataUserNew)
        await this.usersRepository.save(newUser)
        return newUser
    }

    async getByAccount(accountName: string) {
        const account = await this.usersRepository.findOne({
            where: { account: accountName },
            select: {
                id: true,
                account: true,
                email: true
            }
        })
        return account;
    }
}
 