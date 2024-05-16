import { OmitType } from '@nestjs/swagger';
import { StaticPage } from '../entities/static-pages.entity';

export class UpdateStaticPageDto extends OmitType(StaticPage, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
