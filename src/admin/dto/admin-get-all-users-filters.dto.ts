import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { UsersSortByEnum } from '../enum/users-sort-by.enum';
import { SortOrderEnum } from '../../common/enums/sort-order.enum';
import { PaginationFilterDto } from '../../common/dto/pagination/paginationFilters.dto';

export class AdminGetAllUsersFilterDto extends PaginationFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  status: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  createdAt: string;

  @ApiPropertyOptional({ type: UsersSortByEnum })
  @IsOptional()
  sortBy: UsersSortByEnum;

  @ApiPropertyOptional({ type: SortOrderEnum })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  order: SortOrderEnum;
}
