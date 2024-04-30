import { Provider } from '@nestjs/common';
import { Log } from '../entities/log.entity';
import { ENTITIES } from '../../common/constants/entities';

export const logEntityProvider: Provider = {
  provide: ENTITIES.LOG,
  useValue: Log,
};
