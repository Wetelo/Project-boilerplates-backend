import { verificationHtml } from './verification';

const templatesList = {
  verificationHtml,
};

export type templateName = keyof typeof templatesList;

type getTemplate = <T>(receiverOptions: T) => string;

export type Templates = Map<templateName, getTemplate>;

const templates = new Map<templateName, getTemplate>();
for (const template in templatesList) {
  templates.set(template as templateName, templatesList[template]);
}

export { templates };
