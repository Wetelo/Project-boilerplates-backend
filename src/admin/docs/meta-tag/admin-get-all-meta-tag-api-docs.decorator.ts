import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGetAllMetaTagsResponseDto } from '../../dto/responses/meta-tag/admin-get-all-meta-tags-response.dto';

export function AdminGetAllMetaTagApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Get all meta tags' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
    ApiOkResponse({
      type: AdminGetAllMetaTagsResponseDto,
    }),
  );
}
