import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { buildVerificationEmailHtml } from './templates/verification-email.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly isEmailEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isEmailEnabled = configService.get<string>('EMAIL_ENABLED') === 'true';
  }

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    if (!this.isEmailEnabled) {
      this.logger.log(`[EMAIL DISABLED] Verification URL for ${to}: ${verifyUrl}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: Number(this.configService.get<string>('EMAIL_PORT') ?? '587'),
      secure: this.configService.get<string>('EMAIL_PORT') === '465',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    const from =
      this.configService.get<string>('EMAIL_FROM') ?? 'Marvel Outside <noreply@example.com>';

    await transporter.sendMail({
      from,
      to,
      subject: '[Marvel Outside] 이메일 인증을 완료해주세요',
      html: buildVerificationEmailHtml(verifyUrl),
    });

    this.logger.log(`Verification email sent to ${to}`);
  }
}
