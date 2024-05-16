import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function GetStaticPageBySlugApiDocs() {
  return applyDecorators(ApiOperation({ summary: 'Get static page by slug' }));
}
