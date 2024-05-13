import { Module } from '@nestjs/common';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AuthModule } from '../auth/auth.module';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminUserService } from './services/admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AdminAuthService } from './services/admin-auth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User]), UserModule],
  controllers: [AdminAuthController, AdminUserController],
  providers: [AdminUserService, AdminAuthService],
})
export class AdminModule {}
