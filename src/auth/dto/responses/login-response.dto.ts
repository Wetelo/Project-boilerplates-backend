import { ApiProperty } from '@nestjs/swagger';
import { RegisterResponseDto } from './register-response.dto';

export class LoginResponseDto extends RegisterResponseDto {
  @ApiProperty()
  token: string;
}
