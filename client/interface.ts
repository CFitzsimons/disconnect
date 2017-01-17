import IConnection from "../connection/interface";
import IExecutor from "../executor/interface";

interface IClient {
  connection: IConnection;
  executor: IExecutor;
  start(): void;
  stop(): void;
}

interface IClientConstructor {
  new (connection: IConnection, executor: IExecutor): IClient;
}

export default IClient;
