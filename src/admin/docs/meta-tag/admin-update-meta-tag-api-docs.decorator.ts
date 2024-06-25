import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MetaTag } from '../../../meta-tags/entities/meta-tag.entity';
import { UpdateMetaTagDto } from '../../dto/meta-tag/update-meta-tag.dto';

export function AdminUpdateMetaTagApiDocsDecorator() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Update user' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
    ApiBadRequestResponse({
      description: 'Meta tag with this slug or title already exists',
    }),
    ApiBody({ type: UpdateMetaTagDto }),
    ApiOkResponse({ type: MetaTag }),
  );
}
