import { BitLine } from "../components/Squidward/Gates";

export type Dictionary<T> = { [key: string]: T };
export type MultiKeyDictionary<T> = Map<string[], T>; //Revisit this when you discover recursive depth
export type Side = "left" | "right" | "top" | "bottom" //can't use these as keys ffs
export type InOrOut = "in" | "out";
export type BitInOut = [InOrOut, BitLine];
export type SideInput = Dictionary<BitInOut>
export type boolFunc = (arg0: boolean, arg1: boolean) => boolean;
export type unFunc = (arg1: boolean) => boolean;
export type nFunc = (arg: boolean[]) => boolean[];

export type GateEntry = {
  elementName: string;
  elementProps: Dictionary<any>;
  connect?: string;
  func?: boolFunc | unFunc;
};

export type JsonGateDict = Dictionary<GateEntry>;
export type ElementArray = Array<JSX.Element>;
