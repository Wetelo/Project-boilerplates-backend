import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export function UpdateStaticPageApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Update static page by id' }),
  );
}
