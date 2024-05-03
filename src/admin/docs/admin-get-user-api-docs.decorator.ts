import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGetUserResponseDto } from '../dto/responses/admin-get-user-response.dto';

export function AdminGetUserApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Get user' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiOkResponse({ type: AdminGetUserResponseDto }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
  );
}
