import { Provider } from '@nestjs/common';
import { templates } from '../templates';
import { ADDITIONAL_PROVIDERS } from '../../common/constants/additional-providers';

export const templatesProvider: Provider = {
  provide: ADDITIONAL_PROVIDERS.TEMPLATES,
  useValue: templates,
};
