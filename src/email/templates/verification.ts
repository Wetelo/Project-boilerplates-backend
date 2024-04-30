import { IReceiver } from '../interfaces/receiver.interface';

export const verificationHtml = ({
  link,
  code,
  expirationAfterMinutes,
}: Pick<IReceiver, 'link' | 'code' | 'expirationAfterMinutes'>) => {
  return `<p>Hello</p>`;
};
