import { Controller, Get, Param } from '@nestjs/common';
import { StaticPagesService } from '../services/static-pages.service';
import { ApiTags } from '@nestjs/swagger';
import { GetStaticPageBySlugApiDocs } from '../docs/static-page/get-static-page-by-slug-api-docs.decorator';

@ApiTags('static-pages')
@Controller('static-pages')
export class StaticPagesController {
  constructor(private readonly staticPagesService: StaticPagesService) {}

  @Get(':slug')
  @GetStaticPageBySlugApiDocs()
  findOneBySlug(@Param('slug') slug: string) {
    return this.staticPagesService.findOneBySlug(slug);
  }
}
