export interface Store {
  templates: {
    list(): Promise<Template[]>;
    byId(id: string): Promise<Template | void>;
    store(template: Template): Promise<Template>;
    removeById(id: string): Promise<{ ok: boolean }>;
  };

  users: {
    subscribers(afterId?: string): Promise<User[]>;
    list(afterId?: string): Promise<User[]>;
    listByEmail(emails?: string[]): Promise<User[]>;
    store(user: User | User[]): Promise<User | User[]>;
    delete(recordId: string | string[]): Promise<{ ok: boolean }>;
  };
}
