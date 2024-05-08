import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from '../services/pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdf: PdfService) {}

  @Get('/test')
  async generateTestPdf(@Res() res: Response) {
    const pdfBuffer = await this.pdf.generateTestPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="draft.pdf"');
    res.send(pdfBuffer);
  }
}
