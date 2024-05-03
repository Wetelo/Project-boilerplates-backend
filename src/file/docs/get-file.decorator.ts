import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function GetFileApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get file' }),
    ApiBearerAuth('Access-token'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({
      description: 'Your account was blocked',
    }),
    ApiBadRequestResponse({ description: 'File not found' }),
    ApiOkResponse(),
  );
}
