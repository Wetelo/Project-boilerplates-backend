import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export function DeleteStaticPageApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Delete static page by id' }),
  );
}
