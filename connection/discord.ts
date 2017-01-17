import IConnection, { IHandler, IHandlerMap } from "./interface";
const Discord = require("discord.js");

export default class DiscordConnection implements IConnection {
  handlers: IHandlerMap;
  errorHandler: IHandler;
  client: any;

  constructor() {
    this.client = new Discord.Client();
    this.handlers = {};

    // Should expose this and allow the user to define handler.
    this.errorHandler = (errorEvent: any) => {
      console.warn(errorEvent);
    };
  }

  public connect(token: string): void {
    this.client.on("message", this.push.bind(this));
    this.client.login(token).catch(this.error.bind(this));
  }

  public disconnect(): void {
    this.client.destroy();
  }

  public addHandler(handler: IHandler, identity: string): boolean {
    if (this.handlers[identity]) {
      return false;
    }
    this.handlers[identity] = handler;
    return true;
  }

  public removeHandler(identity: string): boolean {
    if (!this.handlers[identity]) {
      return false;
    }
    delete this.handlers[identity];
    return true;
  }
  private error(errorMessage: string): void {
    if (this.errorHandler) {
      this.errorHandler(errorMessage);
    }
  }
  private push(messageEvent: any): void {
    for (const identity in this.handlers) {
      this.handlers[identity](messageEvent);
    }
  }
}
