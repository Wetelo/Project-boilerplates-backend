export interface IReceiver {
  email: string;
  name?: string;
  code?: string;
  link?: string;
  isRegistration?: boolean;
  expirationAfterMinutes?: number;
}
