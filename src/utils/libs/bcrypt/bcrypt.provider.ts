import { Provider } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LIBS } from '../../../common/constants/libs';

export const bcryptProvider: Provider = {
  provide: LIBS.BCRYPT,
  useValue: bcrypt,
};
