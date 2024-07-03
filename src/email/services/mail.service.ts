import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG } from '../../common/enums/config';
import { ADDITIONAL_PROVIDERS } from '../../common/enums/additional-providers';
import { MailDataRequired } from '@sendgrid/mail';
import { LoggerService } from '../../logger/services/logger.service';
import { SendgridType } from '../types/sendgrid.type';

@Injectable()
export class MailService {
  private readonly forgotPasswordUrl = this.configService.get<string>(
    CONFIG.FORGOT_PASSWORD_URL,
  );

  private readonly inviteUrl = this.configService.get<string>(
    CONFIG.INVITE_URL,
  );

  constructor(
    @Inject(ADDITIONAL_PROVIDERS.SENDGRID)
    private readonly transporter: SendgridType,
    private readonly templatesService: TemplatesService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  private SENDER = this.configService.get(CONFIG.SENDER);
  private ADMIN_EMAIL = this.configService.get(CONFIG.ADMIN_EMAIL);

  async send(data: MailDataRequired) {
    try {
      await this.transporter.send(data);
    } catch (error) {
      this.loggerService.error(error);
      throw new InternalServerErrorException();
    }
  }

  async sendForgotPassword({ email, name, code }) {
    const buildTemplate =
      this.templatesService.getTemplate('forgotPasswordHtml');
    const url = `${this.forgotPasswordUrl}?code=${code}&email=${email}`;
    const html = buildTemplate({ name, link: url });
    await this.send({
      from: this.SENDER,
      to: email,
      subject: 'Reset password',
      html,
    });
  }

  async sendVerifyCode({ email, name, code }) {
    const buildTemplate = this.templatesService.getTemplate('verifyCodeHtml');
    const html = buildTemplate({ name, code });
    await this.send({
      from: this.SENDER,
      to: email,
      subject: 'Verification code',
      html,
    });
  }

  async sendUserInvitation({ email, username, expirationTime }) {
    const buildTemplate = this.templatesService.getTemplate('inviteUserHtml');
    //we need it for encoding special symbols such as +
    const encodedEmail = encodeURIComponent(email);
    const url = `${this.inviteUrl}?email=${encodedEmail}`;
    const expiredTimeString = `${expirationTime.toLocaleDateString()} ${expirationTime.toLocaleTimeString()}`;
    const html = buildTemplate({
      username,
      link: url,
      expirationTime: expiredTimeString,
    });
    await this.send({
      from: this.SENDER,
      to: email,
      subject: 'Crypto exchange invitation',
      html,
    });
  }

  async sendTest(email) {
    await this.loggerService.debug({
      reason: 'Send email TEST debug',
      data: email,
    });
    await this.send({
      from: this.SENDER,
      to: email,
      subject: 'Test subject',
      html: '<p>Hello Test</p>',
    });
  }
}
