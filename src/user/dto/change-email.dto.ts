import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
