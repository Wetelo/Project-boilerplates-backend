import { Module } from '@nestjs/common';
import { StaticPagesController } from './contollers/static-pages.controller';
import { staticPagesEntityProvider } from './providers/static-pages-entity.provider';
import { StaticPagesService } from './services/static-pages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticPage } from './entities/static-pages.entity';
import { StaticPageLang } from './entities/static-pages-lang.entity';
import { staticPageLangEntityProvider } from './providers/static-page-lang-entity.provider';

@Module({
  imports: [TypeOrmModule.forFeature([StaticPage, StaticPageLang])],
  controllers: [StaticPagesController],
  providers: [
    StaticPagesService,
    staticPagesEntityProvider,
    staticPageLangEntityProvider,
  ],
  exports: [StaticPagesService],
})
export class StaticPagesModule {}
