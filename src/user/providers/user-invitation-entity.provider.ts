import { Provider } from '@nestjs/common';
import { ENTITIES } from '../../common/enums/entities';
import { UserInvitation } from '../entities/user-invitation.entity';

export const userInvitationEntityProvider: Provider = {
  provide: ENTITIES.USER_INVITATION,
  useValue: UserInvitation,
};
