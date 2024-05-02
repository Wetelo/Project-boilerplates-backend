import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordReponseDto {
  @ApiProperty({ default: 'Success' })
  message: string;

  @ApiProperty()
  token: string;
}
