import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetaTagResponseDto } from '../dto/meta-tag-response.dto';

export function GetMetaTagBySlugApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get meta tag' }),
    ApiResponse({ type: MetaTagResponseDto }),
  );
}
