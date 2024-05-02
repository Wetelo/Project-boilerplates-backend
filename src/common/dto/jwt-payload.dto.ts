import { UserRoleEnum } from '../enums/user-role.enum';

export class JwtPayloadDto {
  id: number;
  role: UserRoleEnum;
}
