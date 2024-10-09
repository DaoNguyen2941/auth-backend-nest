import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from './user.entity';
import { Repository, In, Like } from "typeorm";
import { CreateUserDto } from './user.dto';
import { plainToInstance } from "class-transformer";
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ) { }

    async create(dataUserNew: CreateUserDto) {
        const newUser = await this.usersRepository.create(dataUserNew)
        await this.usersRepository.save(newUser)
        console.log("đã tạo thành công người dùng");
        console.log(newUser);
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
 