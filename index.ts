const constants = require("./configuration/constants.json");
import { DiceRoller } from "./executor/actions";



import Discord from "./connection/discord";


let client = new Discord();

client.addHandler( (event: any) => {
  console.log(event.content);
  if(event.content === "ping")
    event.channel.sendMessage("pong")
}, "main_client");

client.connect(constants.bot_token);
