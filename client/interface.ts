import IConnection from "../connection/interface";

interface IClient {
  new(connection: IConnection): IClient;
  start(): void;
}
