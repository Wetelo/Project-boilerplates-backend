import { Controller } from '@nestjs/common';
import { PdfService } from '../services/pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdf: PdfService) {}

  async generateTestPdf() {
    return await this.pdf.generateTestPdf();
  }
}
