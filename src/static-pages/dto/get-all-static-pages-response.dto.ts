import { ApiProperty } from '@nestjs/swagger';
import { StaticPage } from '../entities/static-pages.entity';
import { PaginationMetaDto } from '../../common/dto/pagination/pagination-meta.dto';

export class GetAllStaticPagesResponseDto {
  @ApiProperty({ isArray: true, type: StaticPage })
  items: StaticPage[];

  @ApiProperty()
  meta: PaginationMetaDto;
}
