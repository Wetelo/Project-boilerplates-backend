import { ApiProperty } from '@nestjs/swagger';

export class AdminAuthResponseDto {
  @ApiProperty()
  token: string;
}
