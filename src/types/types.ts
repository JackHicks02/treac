export type Dictionary<T> = { [key: string]: T };

export type MultiKeyDictionary<T> = Map<string[], T>; //Revisit this when you discover recursive depth

export type boolFunc = (arg0: boolean, arg1: boolean) => boolean;
export type unFunc = ( arg1: boolean) => boolean;

export type GateEntry = {
  elementName: string;
  elementProps: Dictionary<any>;
  connect?: string;
  func?: boolFunc | unFunc;
};

export type JsonGateDict = Dictionary<GateEntry>;

export type ElementArray = Array<JSX.Element>;