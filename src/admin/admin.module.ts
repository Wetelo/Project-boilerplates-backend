import { Module } from '@nestjs/common';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AuthModule } from '../auth/auth.module';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminUserService } from './services/admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AdminAuthService } from './services/admin-auth.service';
import { UserModule } from '../user/user.module';
import { StaticPagesModule } from '../static-pages/static-pages.module';
import { AdminStaticPagesController } from './controllers/admin-static-pages.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User]),
    UserModule,
    StaticPagesModule,
  ],
  controllers: [
    AdminAuthController,
    AdminUserController,
    AdminStaticPagesController,
  ],
  providers: [AdminUserService, AdminAuthService],
})
export class AdminModule {}
