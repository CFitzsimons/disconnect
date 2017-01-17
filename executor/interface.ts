// An action can be defiend by the following parts:
// - trigger
// - parameters
// see the following:
//   '/random 1 6'
// The trigger is '/random' and the parameters are '1 6'

interface IExecutor {
  addAction(action: IAction, identity: string): boolean;
}

export interface IExecutableAction {
  parameterRegex: RegExp;
  trigger: string;
  action: IAction;
}

interface IAction {
  (params: string): string;
}

export default IExecutor;
