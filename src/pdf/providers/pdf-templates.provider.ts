import { Provider } from '@nestjs/common';
import { pdfTemplates } from '../templates';
import { ADDITIONAL_PROVIDERS } from '../../common/enums/additional-providers';

export const pdfTemplatesProvider: Provider = {
  provide: ADDITIONAL_PROVIDERS.PDF_TEMPLATES,
  useValue: pdfTemplates,
};
