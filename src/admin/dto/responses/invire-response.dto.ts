import { ApiProperty } from '@nestjs/swagger';

export class InviteResponseDto {
  @ApiProperty({ default: 'Invitation email has been sent successfully' })
  message: string;
}
