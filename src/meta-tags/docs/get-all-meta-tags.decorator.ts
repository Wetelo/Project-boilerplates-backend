import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetaTagAllResponseDto } from '../dto/meta-tag-all-response.dto';

export function GetAllMetaTagsApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all meta tags' }),
    ApiResponse({ type: MetaTagAllResponseDto }),
  );
}
