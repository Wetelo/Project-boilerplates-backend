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
import { LoginDto } from '../../common/dto/login.dto';
import { AdminAuthResponseDto } from '../dto/responses/admin-auth-response.dto';

export function AdminAuthLoginApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Login to admin panel' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({ type: AdminAuthResponseDto }),
  );
}
