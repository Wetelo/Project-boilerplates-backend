import { Provider } from '@nestjs/common';
import { StaticPage } from '../entities/static-pages.entity';
import { ENTITIES } from '../../common/enums/entities';

export const staticPagesEntityProvider: Provider = {
  provide: ENTITIES.STATIC_PAGES,
  useValue: StaticPage,
};
