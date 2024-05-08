import { draftTemplate } from './draft-template';

const pdfTemplatesList = {
  draftTemplate,
};

export type pdfTemplateName = keyof typeof pdfTemplatesList;

type getPdfTemplate = (...args: any[]) => string;

export type PdfTemplates = Map<pdfTemplateName, getPdfTemplate>;

const pdfTemplates = new Map<pdfTemplateName, getPdfTemplate>();
for (const pdfTemplate in pdfTemplatesList) {
  pdfTemplates.set(
    pdfTemplate as pdfTemplateName,
    pdfTemplatesList[pdfTemplate],
  );
}

export { pdfTemplates };
