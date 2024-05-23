import { Provider } from '@nestjs/common';
import { ENTITIES } from '../../common/enums/entities';
import { StaticPageLang } from '../entities/static-pages-lang.entity';

export const staticPageLangEntityProvider: Provider = {
  provide: ENTITIES.STATIC_PAGE_LANG,
  useValue: StaticPageLang,
};
