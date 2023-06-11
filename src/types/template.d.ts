declare interface Template {
  recordId?: string;
  name: string;
  html: string;
  description: string;
  defaultSubject?: string;
  isDefault?: boolean;
  variables?: string[]; // list of variables available for this template
}
