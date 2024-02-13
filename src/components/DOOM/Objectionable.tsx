import { FC, SetStateAction, useState } from "react";

export interface ObjectionableProps {
  child?: JSX.Element; //Less risky type that will be a stateful component would be ideal...
  // defaultState: State;
}

export type State = { [key: string]: any }; //This is going to have consequences...
export type ChildSetter = React.Dispatch<React.SetStateAction<State>>;

class Objectionable {
  private child: JSX.Element;
  private childSetter: ChildSetter;
  private state: State;

  constructor({ child }: ObjectionableProps) {
    this.child = child ?? <></>;
    this.state = { please: "work" };
    this.childSetter = (() => {}) as ChildSetter;
  }

  getState = () => {
    return this.state;
  };

  setState = (new_state: State) => {
    this.state = { ...this.state, ...new_state };
    this.childSetter && this.childSetter(this.state);
  };

  bindChildSetter = (childSetter: ChildSetter) => {
    this.childSetter = childSetter;
    console.log("internal bind fired");
  };

  render = () => {
    return <></>;
  };
}

export default Objectionable;
