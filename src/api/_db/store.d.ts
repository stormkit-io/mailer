export interface Store {
  templates: {
    list(): Promise<Template[]>;
    byId(id: string): Promise<Template | void>;
    store(template: Template): Promise<Template>;
    removeById(id: string): Promise<{ ok: boolean }>;
  };

  users: {
    store(user: User): Promise<User>;
  };
}
