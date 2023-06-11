export interface Store {
  templates: {
    list(): Promise<Template[]>;
    store(template: Template): Promise<Template>;
  };
}
