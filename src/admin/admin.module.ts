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
import { MetaTagsModule } from '../meta-tags/meta-tags.module';
import { AdminMetaTagService } from './services/admin-meta-tag.service';
import { AdminMetaTagController } from './controllers/admin-meta-tag.controller';
import { MetaTag } from '../meta-tags/entities/meta-tag.entity';
import { metaTagEntityProvider } from '../meta-tags/providers/meta-tags-entity.provider';
import { FileEntity } from '../file/entities/file.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, MetaTag, FileEntity]),
    UserModule,
    StaticPagesModule,
    MetaTagsModule,
  ],
  controllers: [
    AdminAuthController,
    AdminUserController,
    AdminStaticPagesController,
    AdminMetaTagController,
  ],
  providers: [
    AdminUserService,
    AdminAuthService,
    AdminMetaTagService,
    metaTagEntityProvider,
  ],
})
export class AdminModule {}
