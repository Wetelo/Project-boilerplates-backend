import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { EmailModule } from './email/email.module';
import { PdfModule } from './pdf/pdf.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { errorFilterProvider } from './utils/filters/error/error.filter.provider';
import { FileModule } from './file/file.module';
import { StaticPagesModule } from './static-pages/static-pages.module';
import { MetaTagsModule } from './meta-tags/meta-tags.module';

@Module({
  imports: [
    UserModule,
    AdminModule,
    EmailModule,
    PdfModule,
    AuthModule,
    DatabaseModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileModule,
    StaticPagesModule,
    MetaTagsModule,
  ],
  controllers: [AppController],
  providers: [AppService, errorFilterProvider],
})
export class AppModule {}
