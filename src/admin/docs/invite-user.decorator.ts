import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InviteUserDto } from '../dto/invite-user.dto';
import { InviteResponseDto } from '../dto/responses/invire-response.dto';

export function InviteUserApiDocs() {
  return applyDecorators(
    ApiBearerAuth('Access-token'),
    ApiOperation({ summary: 'Invite user' }),
    ApiConflictResponse({
      schema: {
        oneOf: [
          {
            title: 'User is registered',
            description: 'This email is already taken',
            example: { message: 'This email is already taken' },
          },
          {
            title: 'User is invited, but not registered',
            description: 'User with this email is already invited',
            example: { message: 'User with this email is already invited' },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBody({ type: InviteUserDto }),
    ApiOkResponse({ type: InviteResponseDto }),
  );
}
