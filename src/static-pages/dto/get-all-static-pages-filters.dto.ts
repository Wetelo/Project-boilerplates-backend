import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SortOrderEnum } from '../../common/enums/sort-order.enum';
import { PaginationFilterDto } from '../../common/dto/pagination/paginationFilters.dto';

export class GetAllStaticPagesFiltersDto extends PaginationFilterDto {
  @ApiPropertyOptional({ type: SortOrderEnum })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  order: SortOrderEnum;
}
