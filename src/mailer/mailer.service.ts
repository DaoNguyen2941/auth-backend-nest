import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
    private nodemailerTransport: Mail;

    constructor(
        private readonly configService: ConfigService) {
        this.nodemailerTransport = createTransport({
            service: this.configService.get('mailer.service'),
            auth: {
                user: this.configService.get('mailer.user'),
                pass: this.configService.get('mailer.password'),
            }
        })
    }

    async sendMail(options: Mail.Options) {
        try {
            await this.nodemailerTransport.sendMail(options);
        } catch (error) {
            // Kiểm tra lỗi có phải do nodemailer không
            if (error.response) {
                // Nếu có phản hồi từ server mail
                throw new HttpException(
                    `Lỗi gửi email: ${error.response}`,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            // Nếu không có phản hồi rõ ràng, ném ra lỗi chung
            throw new HttpException(
                'Đã xảy ra lỗi không xác định khi gửi email.',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
