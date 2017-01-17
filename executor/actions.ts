import { IExecutableAction } from "./interface";

export class DiceRoller implements IExecutableAction {
  parameterRegex: RegExp;
  trigger: string;

  constructor() {
    this.parameterRegex = new RegExp(/^((\d\d?d\d\d?(-\d\d?)?)|\d\d?)(\+((\d\d?d\d\d?(-\d\d?)?)|\d\d?))*$/);
    this.trigger = "/roll";
  }

  execute(params: string): string {
    params = params.trim();
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
