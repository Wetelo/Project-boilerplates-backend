import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../../common/enums/user-role.enum';

export class UserDto {
  @ApiProperty()
  id: number;
  email: string;
  lastName: string;
  firstName: string;
  phone: string;
  role: UserRoleEnum;
}
export class AdminAuthResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserDto;
}
