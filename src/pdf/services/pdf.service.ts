import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfService {
  async generateTestPdf() {
    return true;
  }
}
