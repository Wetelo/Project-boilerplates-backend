import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LangEnum } from '../../common/enums/lang.enum';
export class StaticPageLangDto {
  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsEnum(LangEnum)
  @IsNotEmpty()
  langId: LangEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateStaticPageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  noIndex: boolean;

  @ApiPropertyOptional({ isArray: true, type: StaticPageLangDto })
  @IsOptional()
  translations: StaticPageLangDto[];
}
