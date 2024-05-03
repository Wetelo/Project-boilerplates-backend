import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/pagination/pagination-meta.dto';
import { AdminGetUserResponseDto } from './admin-get-user-response.dto';

export class AdminGetAllUsersResponseDto {
  @ApiProperty({ isArray: true, type: AdminGetUserResponseDto })
  items: AdminGetUserResponseDto[];

  @ApiProperty()
  meta: PaginationMetaDto;
}
