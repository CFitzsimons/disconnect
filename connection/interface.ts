interface IConnection {
  connect(token: string): void;
  disconnect(): void;
  addHandler(handler: IHandler, identity: string): boolean;
  removeHandler(identity: string): boolean;
  handlers: IHandlerMap;
}

export interface IHandler {
  (message: any): void;
}

export interface IHandlerMap {
  [identity: string]: IHandler;
}

export default IConnection;
