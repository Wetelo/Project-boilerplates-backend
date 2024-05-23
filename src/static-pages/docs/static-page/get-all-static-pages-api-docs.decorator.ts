import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export function GetAllStaticPagesApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Get all static pages paginated with filters' }),
  );
}
