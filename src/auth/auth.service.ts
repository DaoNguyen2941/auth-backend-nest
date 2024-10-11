import { Injectable, HttpException, HttpStatus, Inject, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from "class-transformer";
import { RegisterDto, RegisterResponseDto, ConfirmOtpDto } from './auth.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto'; // Sử dụng để sinh OTP
import { MailerService } from 'src/mailer/mailer.service';
import { CreateUserDto } from 'src/user/user.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async verifyOTP(dataOTP: ConfirmOtpDto): Promise<RegisterResponseDto> {
        try {
            const userNew: RegisterDto | any = await this.cacheManager.get(`userNew ${dataOTP.email}`)
            const userOtp = await this.cacheManager.get(`otp ${dataOTP.email}`)
            const cachOtp = await this.cacheManager.get(`otp email`)
            console.log(userNew);
            console.log(userOtp);
            
            if (userNew === null) {
                throw new HttpException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: 'Phiên Đã Hết Hạn!',
                    error: 'BAD REQUEST'
                },
                    HttpStatus.UNPROCESSABLE_ENTITY
                )
            }

            if (dataOTP.OTP !== userOtp) {
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    message: 'OTP không đúng hoạc đã hết hạn!',
                    error: 'BAD REQUEST'
                },
                    HttpStatus.NOT_ACCEPTABLE
                )
            }

            if (dataOTP.OTP === userOtp) {
                const user = await this.usersService.create(userNew)
                await this.cacheManager.del(`userNew ${dataOTP.email}`)

                return plainToInstance(RegisterResponseDto, user, {
                    excludeExtraneousValues: true,
                })
            }
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Đã xảy ra lỗi không mong muốn.',
                    error: 'SERVER_ERROR',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );

        } catch (error) {
            // Xử lý lỗi một cách tổng quát
            if (error instanceof HttpException) {
                // Nếu lỗi là HttpException, ném lại nó để NestJS xử lý
                throw error;
            } else {
                // Xử lý các lỗi không mong muốn khác
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Đã xảy ra lỗi không mong muốn trong quá trình xác thực OTP.',
                        error: 'SERVER_ERROR',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    public async authGmail(email: string) {
        const otp = await this.generateOtp(6);
        await this.cacheManager.set(`otp ${email}`, otp, 300000)
        const cachOtp = await this.cacheManager.get(`otp ${email}`)
        console.log(cachOtp);
        
        const text = `Your OTP code is: ${otp}. It will expire after 5 minutes. Please do not share this code with anyone.`;
        return await this.mailerService.sendMail({
            to: email,
            subject: `Your OTP - ${otp}`,
            text,
        });
    }

    private async generateOtp(length: number) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    }

    public async register(userData: RegisterDto): Promise<RegisterResponseDto> {
        const dataAccont = await this.usersService.getByAccount(userData.account)
        const cacheUserData = await this.cacheManager.get(`userNew ${userData.email}`)
        if (dataAccont === null && cacheUserData === undefined) {
            userData.password = await this.hashPassword(userData.password)
            await this.cacheManager.set(`userNew ${userData.email}`, userData, 600000);
            const data = await this.cacheManager.get(`userNew ${userData.email}`)
            return plainToInstance(RegisterResponseDto, data, {
                excludeExtraneousValues: true,
            })
        }
        throw new HttpException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Tài khoản đã tồn tại, hãy lấy tên tài khoản khác!',
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
