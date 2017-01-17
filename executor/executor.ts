import IExecutor, { IExecutableMap, IExecutableAction } from "./interface";

export default class Executor implements IExecutor {
  executables: IExecutableMap;

  constructor() {
    this.executables = {};
  }

  addAction(action: IExecutableAction, identity: string): boolean {
    if (identity !== action.trigger) {
      throw new RangeError("Identity provided must be the same as the action trigger.");
    }
    if (this.executables[identity]) {
      return false;
    }
    this.executables[identity] = action;
  }

  removeAction(identity: string): boolean {
    if (!this.executables[identity]) {
      return false;
    }
    delete this.executables[identity];
    return true;
  }

  execute(identity: string, parameters: string): string {
    if (!this.executables[identity]) {
      return "";
    }
    try {
      return this.executables[identity].execute(parameters);
    } catch (error) {
      console.warn(error);
    }
    return "";
  }
}
