import { Inject, Injectable } from '@nestjs/common';
import { ADDITIONAL_PROVIDERS } from '../../common/enums/additional-providers';
import { PuppeteerLaunchOptions, PuppeteerNode } from 'puppeteer';
import { PdfTemplatesService } from './pdf-template.service';

@Injectable()
export class PdfService {
  constructor(
    @Inject(ADDITIONAL_PROVIDERS.PUPPETEER)
    private readonly puppeteer: PuppeteerNode,
    private readonly pdfTemplateService: PdfTemplatesService,
  ) {}
  async generateTestPdf() {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    const buildPdf = this.pdfTemplateService.getPdfTemplate('draftTemplate');

    const pdfHtml = buildPdf();

    // case for simple html without templates
    // const pdfHtml = '<p>Hello</p><p>This is draft pdf</p>';
    // const header = '<table><tr><td>Header</td></tr></table>';
    // const footer = '<table><tr><td>Footer</td></tr></table>';

    await page.setContent(pdfHtml, { waitUntil: ['load', 'networkidle2'] });
    await page.emulateMediaType('screen');
    const pdf = await page.pdf({
      format: 'A4',
      // displayHeaderFooter: true,
      // footerTemplate: footer,
      // headerTemplate: header,
    });
    await browser.close();
    return pdf;
  }

  async getBrowser() {
    const options: PuppeteerLaunchOptions = {
      args: ['--no-sandbox'],
      headless: true,
    };
    // it's necessary for arm64 server architecture
    // options['executablePath'] = '/usr/bin/chromium-browser';
    return await this.puppeteer.launch(options);
  }
}
