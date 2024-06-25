import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../../common/dto/pagination/pagination-meta.dto';
export class AdminMetaTagItemDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  slug: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdAt: Date;
}

export class AdminGetAllMetaTagsResponseDto {
  @ApiProperty({ isArray: true, type: AdminMetaTagItemDto })
  items: AdminMetaTagItemDto[];

  @ApiProperty()
  meta: PaginationMetaDto;
}
