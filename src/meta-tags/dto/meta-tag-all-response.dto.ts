import { ApiProperty } from '@nestjs/swagger';
import { MetaTagResponseDto } from './meta-tag-response.dto';

export class MetaTagAllResponseDto {
  @ApiProperty()
  items: MetaTagResponseDto[];
}
