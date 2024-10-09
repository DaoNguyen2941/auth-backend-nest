import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from "class-transformer";
import { RegisterDto, RegisterResponseDto } from './auth.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService
    ) { }

    public async authGmail() {
        
    }

    public async register(userData: RegisterDto): Promise<RegisterResponseDto> {
        const dataAccont = await this.usersService.getByAccount(userData.account)
        console.log(dataAccont);
        if (dataAccont === null) {
            userData.password = await this.hashPassword(userData.password)
            // sử lý lưu tạm thời userData vào cache 
            //gửi mã xác thực đến gmail ở userData.gmail
            // sau khi người dùng xác thực thì lưu userData vào database (thực hiện ở this.authGmail)
            //.....
            return plainToInstance(RegisterResponseDto, dataAccont, {
                excludeExtraneousValues: true
            })
        }
        throw new HttpException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: [
                'Tài khoản đã tồn tại, hãy lấy tên tài khoản khác!',
            ],
            error: 'BAD REQUEST'
        },
            HttpStatus.UNPROCESSABLE_ENTITY
        )
    }

    public async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        const salt = await bcrypt.genSalt(saltOrRounds);
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword
    }
}
