import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RegisterResponseDto } from '../dto/responses/register-response.dto';
import { CreateInvitedUserDto } from '../dto/create-invite-user.dto';

export function RegisterInvitedUserApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Register invited user' }),
    ApiConflictResponse({
      schema: {
        title: 'Credentials conflict',
        example: { message: 'This email is already taken' },
        description: 'This email is already taken',
      },
    }),
    ApiOkResponse({ type: RegisterResponseDto }),
    ApiNotFoundResponse({
      schema: {
        title: 'Invitation not found',
        example: { message: 'Invitation not found' },
        description: 'Invitation not found',
      },
    }),
    ApiBadRequestResponse({
      schema: {
        title: 'Invitation link was expired',
        example: {
          message: 'Your invite link was expired. Please try again',
        },
        description: 'Your invite link was expired. Please try again',
      },
    }),
    ApiBody({ type: CreateInvitedUserDto }),
  );
}
