import { Injectable, HttpException, HttpStatus, Inject, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from "class-transformer";
import { RegisterDto, RegisterResponseDto, ConfirmOtpDto,LoginDto } from './auth.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto'; // Sử dụng để sinh OTP
import { MailerService } from 'src/mailer/mailer.service';
import { BasicUserDataDto } from 'src/user/user.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }


    async userLogin(loginData: LoginDto) {
        console.log(loginData);
        const userData = await this.usersService.getByAccount(loginData.account)
        console.log(userData);
        
        const isPasswordMatching = await bcrypt.compare(
            loginData.password,
            userData?.password || 'null'
          );
          if (!isPasswordMatching || userData === null) {
            throw new UnauthorizedException();
          }
          return userData
    }

    async verifyOTP(dataOTP: ConfirmOtpDto): Promise<RegisterResponseDto> {
        try {
            const userNew: RegisterDto | any = await this.cacheManager.get(`userNew ${dataOTP.email}`)
            const userOtp = await this.cacheManager.get(`otp ${dataOTP.email}`)

            if (userNew === undefined) {
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
                await this.cacheManager.del(`otp ${dataOTP.email}`)
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
        try {
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
        } catch (error) {
            if (error instanceof Error) {
                // Xử lý lỗi khi gửi email
                if (error.message.includes('sendMail')) {
                    throw new HttpException(
                        'Lỗi gửi email, vui lòng thử lại sau.',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
            }
            // Nếu không phải lỗi cụ thể, ném lại lỗi chung
            throw new HttpException(
                'Đã xảy ra lỗi không xác định khi xác thực.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }


    public async register(userData: RegisterDto): Promise<RegisterResponseDto> {
        try{
            const dataAccont = await this.usersService.getByAccount(userData.account)
            const cacheUserData = await this.cacheManager.get(`userNew ${userData.email}`)
            // kiểm tra tài khoản đã tồn tại hay chưa
            if (dataAccont === null && cacheUserData === undefined) {
                userData.password = await this.hashPassword(userData.password)
                // lưu tạm user vào cache (10p)
                await this.cacheManager.set(`userNew ${userData.email}`, userData, 600000);
                return plainToInstance(RegisterResponseDto, userData, {
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
        } catch (error) {
            if (error instanceof HttpException) {
                // Nếu là lỗi đã ném ra HttpException, ném lại
                throw error;
            }
            // Xử lý lỗi khác (lỗi không xác định)
            throw new HttpException(
                'Đã xảy ra lỗi không xác định trong quá trình đăng ký.',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        
    }

    private async generateOtp(length: number) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    }

    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        const salt = await bcrypt.genSalt(saltOrRounds);
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword
    }
}
