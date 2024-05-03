import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../../common/enums/user-role.enum';

export class AdminGetUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: UserRoleEnum })
  role: UserRoleEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  status: boolean;
}
