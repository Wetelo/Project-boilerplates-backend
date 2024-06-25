import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateMetaTagDto } from '../../dto/meta-tag/create-meta-tag.dto';
import { MetaTag } from '../../../meta-tags/entities/meta-tag.entity';

export function AdminCreateMetaTagApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Create meta tag' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
    ApiBadRequestResponse({
      description: 'Meta tag with this slug or title already exists',
    }),
    ApiBody({ type: CreateMetaTagDto }),
    ApiOkResponse({ type: MetaTag }),
  );
}
