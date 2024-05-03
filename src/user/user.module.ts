import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserVerificationService } from './services/user-verification.service';
import { EmailModule } from '../email/email.module';
import { UserVerification } from './entities/user-verification.entity';
import { userVerificationEntityProvider } from './providers/user-verification-entity.provider';
import { FileEntity } from '../file/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserVerification, FileEntity]),
    EmailModule,
  ],
  providers: [
    UserService,
    UserVerificationService,
    userVerificationEntityProvider,
  ],
  exports: [
    UserService,
    userVerificationEntityProvider,
    UserVerificationService,
  ],
  controllers: [UserController],
})
export class UserModule {}
