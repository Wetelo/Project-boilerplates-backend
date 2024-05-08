import { Inject, Injectable } from '@nestjs/common';
import { PdfTemplates, pdfTemplateName } from '../templates';
import { ADDITIONAL_PROVIDERS } from '../../common/enums/additional-providers';

@Injectable()
export class PdfTemplatesService {
  constructor(
    @Inject(ADDITIONAL_PROVIDERS.PDF_TEMPLATES)
    private pdfTemplates: PdfTemplates,
  ) {}

  getPdfTemplate(template: pdfTemplateName) {
    return this.pdfTemplates.get(template);
  }
}
