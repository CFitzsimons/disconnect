const constants = require("./configuration/constants.json");

import Discord from "./connection/discord";


let client = new Discord();

client.addHandler( (event: any) => {
  console.log(event.content);
}, "main_client");

client.connect(constants.bot_token);
