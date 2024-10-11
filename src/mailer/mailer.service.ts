import { Injectable } from '@nestjs/common';
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

    sendMail(options: Mail.Options) {
        return this.nodemailerTransport.sendMail(options);
      }
      
}
