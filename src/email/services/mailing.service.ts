import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import {
  IReceiver,
} from '../interfaces/receiver.interface';
import { ConfigService } from '@nestjs/config';
import { CONFIG } from '../../common/constants/config';
import { ADDITIONAL_PROVIDERS } from '../../common/constants/additional-providers';
import { MailDataRequired } from '@sendgrid/mail';
import { LoggerService } from '../../logger/services/logger.service';
import { SendgridType } from '../types/sendgrid.type';

@Injectable()
export class MailService {
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

  async sendVerification({
    email,
    name,
    code,
    expirationAfterMinutes,
  }: IReceiver) {
    const buildTemplate = this.templatesService.getTemplate('verificationHtml');
    const link = '';
    const html = buildTemplate<
      Pick<IReceiver, 'code' | 'expirationAfterMinutes' | 'name' | 'link'>
    >({ name, code, link, expirationAfterMinutes });
    await this.send({
      from: this.SENDER,
      to: email,
      subject: '',
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
