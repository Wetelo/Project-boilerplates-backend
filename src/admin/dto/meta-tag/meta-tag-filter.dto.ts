import { PaginationFilterDto } from '../../../common/dto/pagination/paginationFilters.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrderEnum } from '../../../common/enums/sort-order.enum';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { MetaTagSortByEnum } from '../../enum/meta-tag-sort-by.enum';

export class MetaTagFilterDto extends PaginationFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  createdAt: string;

  @ApiPropertyOptional({ type: MetaTagSortByEnum })
  @IsOptional()
  sortBy: MetaTagSortByEnum;

  @ApiPropertyOptional({ type: SortOrderEnum })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  order: SortOrderEnum;
}
