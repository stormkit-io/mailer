export interface Store {
  templates: {
    list(): Promise<Template[]>;
    byId(id: string): Promise<Template | void>;
    store(template: Template): Promise<Template>;
  };
}
