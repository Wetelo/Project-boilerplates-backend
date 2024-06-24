import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaTag } from './entities/meta-tag.entity';
import { MetaTagService } from './services/meta-tag.service';
import { MetaTagsController } from './controllers/meta-tags.controller';
import { metaTagEntityProvider } from './providers/meta-tags-entity.provider';

@Module({
  imports: [TypeOrmModule.forFeature([MetaTag])],
  providers: [MetaTagService, metaTagEntityProvider],
  controllers: [MetaTagsController],
})
export class MetaTagsModule {}
