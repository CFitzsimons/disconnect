const request = require("request");
const constants = require("../configuration/constants");
import { IExecutableAction } from "./interface";

export class DiceRoller implements IExecutableAction {
  parameterRegex: RegExp;
  trigger: string;

  constructor() {
    this.parameterRegex = new RegExp(/^((\d\d?d\d\d?(-\d\d?)?)|\d\d?)(\+((\d\d?d\d\d?(-\d\d?)?)|\d\d?))*$/);
    this.trigger = "/roll";
  }

  execute(params: string): string {
    params = params.replace(/\s/g,"");
    if (!this.parameterRegex.test(params)) {
      console.log(params);
      throw new RangeError("/roll 1d6(+1d8|2)");
    }
    const parts = params.split("+");
    let result = "";
    let total = 0;
    for (let diceSet of parts) {
      if (result !== "") {
        result += " + ";
      }
      let negative = 0;
      /* Logic for negative number */
      if (diceSet.indexOf("-") !== -1) {
        negative = -Number(diceSet.split("-")[1]);
        diceSet = diceSet.split("-")[0];
      }
      /* This is in the case of a plain number */
      let num = Number(diceSet);
      if (!isNaN(num)) {
        total += num;
        result += diceSet;
        continue;
      }
      /* Logic for dice rolling */
      let amount = parseInt(diceSet.split("d")[0]);
      let upper = parseInt(diceSet.split("d")[1]);
      let random = Math.ceil((Math.random() * upper));
      result += diceSet + "[" + random;
      total += random;
      for (let i = 1; i < amount; i++) {
        random = Math.ceil((Math.random() * 6));
        total += random;
        result += ", " + random;
      }
      if (negative < 0) {
        total += negative;
        result += ", " + negative;
      }
      result += "]";
    }
    return result + " = " + total;

  }
}

export class SiegeLookup<T> implements IExecutableAction {
  parameterRegex: RegExp;
  trigger: string;

  constructor() {
    this.parameterRegex = new RegExp(/^[a-zA-Z0-9\.\_]+$/);
    this.trigger = "/lookup";
  }

  execute(params: string): any {
    params = params.replace(/\s/g, "");
    if (!this.parameterRegex.test(params)) {
      throw new RangeError("/roll 1d6(+1d8|2)");
    }
    return new Promise(async (resolve, reject) => {
      let token = (await(this.fetchToken())).toString();
      if (token === "Rate limited, try again later.") {
        resolve(token);
        return;
      }
      let uid = (await(this.fetchUser(params, token))).toString();
      let stats = (await(this.fetchStats(params, uid, token))).toString();
      resolve(stats);
    });
  }

  async fetchToken(): Promise<{}> {
    return new Promise((resolve, reject) => {
      request.post(`https://${constants.ubi_email}:${constants.ubi_password}@connect.ubi.com/ubiservices/v2/profiles/sessions`, {
        "headers": {
          "Content-Type": "application/json",
          "Ubi-AppId": constants.appID
        }
      }, (error, data, user) => {
        let body = JSON.parse(data.body);
        if (body.errorCode) {
          resolve("Rate limited, try again later.");
          return;
        }
        resolve(body.ticket);
      });
    });
  }
  async fetchUser(params: string, token: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      request.get(`https://public-ubiservices.ubi.com/v2/profiles?nameOnPlatform=${params}&platformType=uplay`, {
        "headers": {
          "Content-Type": "application/json",
          "Ubi-AppId": constants.appID,
          "Authorization": `Ubi_v1 t=${token}`
        }
      }, (error, data, user) => {
        let req = JSON.parse(data.body);
        if (req.errorCode) {
          resolve("Invalid user");
          return;
        }
        if (req.profiles.length !== 1) {
          resolve("Invalid user");
          return;
        }
        resolve(req.profiles[0].profileId);
      });
    });
  }
  async fetchStats(params: string, uid: string, token: string) {
    return new Promise((resolve, reject) => {
      request.get(`https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics?populations=${uid}&statistics=generalpvp_timeplayed,generalpvp_matchplayed,generalpvp_matchwon,generalpvp_matchlost,generalpvp_kills,generalpvp_death,generalpvp_bullethit,generalpvp_bulletfired,generalpvp_killassists,generalpvp_revive,generalpvp_headshot,generalpvp_penetrationkills,generalpvp_meleekills,rescuehostagepvp_bestscore,plantbombpvp_bestscore`, {
        "headers": {
          "Content-Type": "application/json",
          "Ubi-AppId": constants.appID,
          "Authorization": `Ubi_v1 t=${token}`
        }
      }, (error, data, user) => {
        let result = JSON.parse(data.body);
        if (!result.results || result.results[uid]) {
          resolve("Couldn't find user.");
          return;
        } else {
          let data = result.results[uid];
          if (!data) {
            resolve("User has an account but hasn\'t played siege (or something broke).");
            return;
          }
          let kd = (data["generalpvp_kills:infinite"] / data["generalpvp_death:infinite"]).toFixed(2);
          let winPercentage = Math.round((data["generalpvp_matchwon:infinite"] / data["generalpvp_matchplayed:infinite"]) * 100);
          let accuracy = Math.round((data["generalpvp_bullethit:infinite"] / data["generalpvp_bulletfired:infinite"]) * 100);
          let assists = data["generalpvp_killassists:infinite"];
          let timePlayed = Math.round(data["generalpvp_timeplayed:infinite"] / 3600);
          resolve(`${params}\nK/D: ${kd}\nWin Rate: ${winPercentage}%\nAccuracy: ${accuracy}%\nAssists: ${assists}\nTime Played: ${timePlayed}hrs\n`);
        }
      });
    });
  }
}
