import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetaTagService } from '../services/meta-tag.service';

@ApiTags('meta-tags')
@Controller('meta-tags')
export class MetaTagsController {
  constructor(private readonly metaService: MetaTagService) {}

  @Get()
  async getAll() {
    return await this.metaService.getAll();
  }

  @Get('/:slug')
  async getOneBySlug(@Query('slug') slug: string) {
    return await this.metaService.getOneBySlug(slug);
  }
}
