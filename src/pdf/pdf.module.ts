import { Module } from '@nestjs/common';
import { PdfController } from './controllers/pdf.controller';
import { PdfService } from './services/pdf.service';
import { puppeteerProvider } from './providers/puppeteer.provider';
import { pdfTemplatesProvider } from './providers/pdf-templates.provider';
import { PdfTemplatesService } from './services/pdf-template.service';

@Module({
  controllers: [PdfController],
  providers: [
    PdfService,
    puppeteerProvider,
    pdfTemplatesProvider,
    PdfTemplatesService,
  ],
})
export class PdfModule {}
