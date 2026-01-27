import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextStore {
  reqId: string;
  userId?: string;
  path?: string;
  method?: string;
}

export class RequestContext {
  private static als = new AsyncLocalStorage<RequestContextStore>();

  static run(store: RequestContextStore, callback: () => void): void {
    this.als.run(store, () => {
      callback();
    });
  }

  static get(): RequestContextStore | undefined {
    const store = this.als.getStore();
    if (!store) {
      return undefined;
    }
    return store;
  }

  static getReqId(): string | undefined {
    const store = this.get();
    if (!store) {
      return undefined;
    }
    return store.reqId;
  }

  static setUserId(userId?: string): void {
    const store = this.get();
    if (!store) {
      return;
    }
    store.userId = userId;
  }
}
