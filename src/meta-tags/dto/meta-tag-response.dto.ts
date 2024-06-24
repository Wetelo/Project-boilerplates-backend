import { ApiProperty } from '@nestjs/swagger';

export class MetaTagResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  keywords: string;

  @ApiProperty()
  imageUrl: string;
}
