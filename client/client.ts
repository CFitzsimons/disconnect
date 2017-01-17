import IClient from "./interface";
import IConnection from "../connection/interface";
import IExecutor from "../executor/interface";

import DiscordConnection from "../connection/discord";
import Executor from "../executor/executor";

import { DiceRoller } from "../executor/actions";

const constants = require("../configuration/constants.json");

export default class DiscordClient implements IClient {

  connection: IConnection;
  executor: IExecutor;

  constructor() {
    this.connection = new DiscordConnection();
    this.executor = new Executor();
    this.connection.addHandler(this.handleMessage.bind(this), "message_handler");
    /* Command setup */
    let dice = new DiceRoller();
    this.executor.addAction(dice, dice.trigger);
  }

  start(): void {
    this.connection.connect(constants.bot_token);
  }
  stop(): void {
    this.connection.disconnect();
  }

  handleMessage(event: any) {
    let spaceIndex = event.content.indexOf(" ");
    if (spaceIndex < 0) return;

    let identity = event.content.substring(0, spaceIndex);
    let params = event.content.substring(spaceIndex, event.content.length);
    let result = this.executor.execute(identity, params);
    if (result !== "") {
      event.reply(`${result}`);
    }
  }
}
