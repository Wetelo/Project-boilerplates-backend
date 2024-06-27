import { Provider } from '@nestjs/common';
import { ENTITIES } from '../../common/enums/entities';
import { UserRefreshToken } from '../entities/user-refresh-token.entity';

export const userRefreshTokenProvider: Provider = {
  provide: ENTITIES.USER_REFRESH_TOKEN,
  useValue: UserRefreshToken,
};
