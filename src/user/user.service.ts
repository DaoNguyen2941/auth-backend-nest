import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from './user.entity';
import { Repository, In, Like } from "typeorm";
import { BasicUserDataDto, userDataDto } from './user.dto';
import { plainToInstance } from "class-transformer";
import { RegisterDto } from 'src/auth/auth.dto';
import { QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { hashData } from 'src/common/utils';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ) { }

    async removeRefreshToken(userId: string) {
        try {
            return await this.usersRepository.update(
                { id: userId },
                {
                    refresh_token: null
                });
        } catch (error) {
            throw new HttpException(
                'Đã xảy ra lỗi không xác định',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async setRefreshToken(refreshTokenData: string, userId: string) {
        try {
            const refreshTokenHash = await hashData(refreshTokenData);
            await this.usersRepository.update(
                { id: userId },
                {
                    refresh_token: refreshTokenHash
                });
        } catch (error) {
            throw new HttpException(
                'Đã xảy ra lỗi không xác định',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async verifyRefreshToken(refreshToken: string, userId: string): Promise<userDataDto | null> {
        const user = await this.getById(userId);
        if (!user.refresh_token) {
            throw new UnauthorizedException();
        }
        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.refresh_token
        );

        if (isRefreshTokenMatching) {
            return plainToInstance(userDataDto, user, {
                excludeExtraneousValues: true,
            })
        }
        return null
    }

    async create(dataUserNew: RegisterDto) {
        try {
            const newUser = await this.usersRepository.create(dataUserNew)
            await this.usersRepository.save(newUser)
            return newUser
        } catch (error) {
            // Kiểm tra nếu lỗi là do truy vấn cơ sở dữ liệu
            if (error instanceof QueryFailedError) {
                // Kiểm tra lỗi cụ thể, lỗi trùng lặp
                if ((error as any).driverError.errno == '1062') { // 23505 là mã lỗi trùng lặp
                    throw new HttpException(
                        'Tên tài khoản đã tồn tại hoạc email đã đang ký. Hãy chọn thông tin khác.',
                        HttpStatus.CONFLICT
                    );
                }
                throw new HttpException(
                    'Lỗi truy vấn cơ sở dữ liệu',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            // Xử lý các lỗi không xác định khác
            throw new HttpException(
                'Đã xảy ra lỗi không xác định',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

    }

    async getById(userId: string): Promise<BasicUserDataDto> {
        try {
            const account = await this.usersRepository.findOne({
                where: { id: userId },
                select: {
                    id: true,
                    account: true,
                    email: true,
                    password: true,
                    refresh_token: true
                }
            });
            return plainToInstance(BasicUserDataDto, account, {
                excludeExtraneousValues: true,
            })

        } catch (error) {
            // Kiểm tra nếu lỗi là do truy vấn cơ sở dữ liệu
            if (error instanceof QueryFailedError) {
                throw new HttpException(
                    'Lỗi truy vấn cơ sở dữ liệu',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            // Ném lại các lỗi khác (ví dụ lỗi HttpException)
            throw new HttpException(
                'Đã xảy ra lỗi không xác định',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getByAccount(accountName: string): Promise<BasicUserDataDto> {
        try {
            const account = await this.usersRepository.findOne({
                where: { account: accountName },
                select: {
                    id: true,
                    account: true,
                    email: true,
                    password: true,
                    refresh_token: true
                }
            });
            return plainToInstance(BasicUserDataDto, account, {
                excludeExtraneousValues: true,
            })

        } catch (error) {
            // Kiểm tra nếu lỗi là do truy vấn cơ sở dữ liệu
            if (error instanceof QueryFailedError) {
                throw new HttpException(
                    'Lỗi truy vấn cơ sở dữ liệu',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            // Ném lại các lỗi khác (ví dụ lỗi HttpException)
            throw new HttpException(
                'Đã xảy ra lỗi không xác định',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}