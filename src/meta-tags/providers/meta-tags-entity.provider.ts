import { Provider } from '@nestjs/common';
import { ENTITIES } from '../../common/enums/entities';
import { MetaTag } from '../entities/meta-tag.entity';

export const metaTagEntityProvider: Provider = {
  provide: ENTITIES.META_TAG,
  useValue: MetaTag,
};
