import { Provider } from '@nestjs/common';
import { ADDITIONAL_PROVIDERS } from '../../common/enums/additional-providers';
import puppeteer from 'puppeteer';

export const puppeteerProvider: Provider = {
  provide: ADDITIONAL_PROVIDERS.PUPPETEER,
  useValue: puppeteer,
};
