import { FC, SetStateAction, useState } from "react";

export interface ObjectionableProps {
  child?: JSX.Element; //Less risky type that will be a stateful component would be ideal...
  // defaultState: State;
  ConnectedSetters?: ConnectedSetters;
}

export type State = { [key: string]: any }; //This is going to have consequences...
export type ChildSetter = React.Dispatch<React.SetStateAction<boolean>>;
type ConnectedSetters = Array<(new_state: State) => void>;

class Objectionable2 {
  private child: JSX.Element;
  private childSetter: ChildSetter;
  private state: State;
  private connectedSetters: ConnectedSetters;

  constructor({ child, ConnectedSetters }: ObjectionableProps) {
    this.child = child ?? <></>;
    this.state = { please: "work" };
    this.childSetter = (() => {}) as ChildSetter;
    this.connectedSetters = ConnectedSetters ?? ([] as ConnectedSetters);
  }

  getState = () => {
    return this.state;
  };

  setState = (new_state: State) => {
    this.state = { ...this.state, ...new_state };
    this.childSetter && this.childSetter((prevState) => !prevState);
    this.connectedSetters.forEach((setter) => {
      setter(this.state);
    });
  };

  bindChildSetter = (childSetter: ChildSetter) => {
    this.childSetter = childSetter;
    console.log("internal bind fired");
  };

  pushSetter = (setter: (new_state: State) => void) => {
    this.connectedSetters.push(setter);
  };

  render = () => {
    return <></>;
  };
}

export default Objectionable2;
