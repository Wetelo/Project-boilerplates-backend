import { Module } from '@nestjs/common';
import { StaticPagesController } from './contollers/static-pages.controller';
import { staticPagesEntityProvider } from './providers/static-pages-entity.provider';
import { StaticPagesService } from './services/static-pages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticPage } from './entities/static-pages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaticPage])],
  controllers: [StaticPagesController],
  providers: [StaticPagesService, staticPagesEntityProvider],
  exports: [StaticPagesService],
})
export class StaticPagesModule {}
