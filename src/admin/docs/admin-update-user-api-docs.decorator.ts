import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminUserUpdateResponseDto } from '../dto/responses/admin-user-update-response.dto';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';

export function AdminUpdateUserApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Update user' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
    ApiBody({ type: AdminUpdateUserDto }),
    ApiOkResponse({ type: AdminUserUpdateResponseDto }),
  );
}
