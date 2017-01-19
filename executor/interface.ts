// An action can be defiend by the following parts:
// - trigger
// - parameters
// see the following:
//   '/random 1 6'
// The trigger is '/random' and the parameters are '1 6'

interface IExecutor {
  executables: IExecutableMap;
  addAction(action: IExecutableAction, identity: string): boolean;
  removeAction(identity: string): boolean;
  execute(identity: string, parameters: string): any;
}

export interface IExecutableMap {
  [identity: string]: IExecutableAction;
}

export interface IExecutableAction {
  parameterRegex: RegExp;
  trigger: string;
  execute: IAction;
}

interface IAction {
  (params: string): any;
}

export default IExecutor;
