import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG } from '../common/enums/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { userEntityProvider } from '../user/providers/user-entity.provider';
import { BcryptModule } from '../utils/libs/bcrypt/bcrypt.module';
import { UserModule } from '../user/user.module';
import { JwtRefreshTokenStrategy } from './passport-strategies/jwt-refresh-token.strategy';
import { UserInvitation } from '../user/entities/user-invitation.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, UserInvitation]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(CONFIG.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(CONFIG.JWT_EXPIRATION_TIME) + 'd',
        },
      }),
    }),
    BcryptModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    userEntityProvider,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
