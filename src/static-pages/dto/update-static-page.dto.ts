import { OmitType } from '@nestjs/swagger';
import { StaticPage } from '../entities/static-pages.entity';

//TODO refactor
export class UpdateStaticPageDto extends OmitType(StaticPage, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
