import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
