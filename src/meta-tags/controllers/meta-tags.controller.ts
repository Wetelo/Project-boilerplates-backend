import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetaTagService } from '../services/meta-tag.service';
import { GetAllMetaTagsApiDocs } from '../docs/get-all-meta-tags.decorator';
import { GetMetaTagBySlugApiDocs } from '../docs/get-meta-tag-by-slug.decorator';

@ApiTags('meta-tags')
@Controller('meta-tags')
export class MetaTagsController {
  constructor(private readonly metaService: MetaTagService) {}

  @GetAllMetaTagsApiDocs()
  @Get()
  async getAll() {
    return await this.metaService.getAll();
  }

  @GetMetaTagBySlugApiDocs()
  @Get('/:slug')
  async getOneBySlug(@Query('slug') slug: string) {
    return await this.metaService.getOneBySlug(slug);
  }
}
