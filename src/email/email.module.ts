import { Module } from '@nestjs/common';
import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';
import { TemplatesService } from './services/templates.service';
import { MailingProvider } from './providers/mailing.provider';
import { templatesProvider } from './providers/templates.provider';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [MailController],
  providers: [
    MailService,
    TemplatesService,
    MailingProvider,
    templatesProvider,
  ],
  exports: [MailService],
})
export class EmailModule {}
