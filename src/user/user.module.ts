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
import { FileModule } from '../file/file.module';
import { UserRefreshToken } from './entities/user-refresh-token.entity';
import { userRefreshTokenProvider } from './providers/user-refresh-token.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserVerification,
      FileEntity,
      UserRefreshToken,
    ]),
    EmailModule,
    FileModule,
  ],
  providers: [
    UserService,
    UserVerificationService,
    userVerificationEntityProvider,
    userRefreshTokenProvider,
  ],
  exports: [
    UserService,
    userVerificationEntityProvider,
    UserVerificationService,
  ],
  controllers: [UserController],
})
export class UserModule {}
