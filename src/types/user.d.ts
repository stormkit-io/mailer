declare interface User {
  recordId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isUnsubscribed: boolean;
  attributes?: Record<string, unknown>;
}
