import { Coordinate } from "../../app";

import Point2 from "./Point2";
import { setVectorPoint } from "./PointVector";

class PrototypePoint {
  private centre: Coordinate;
  private vectorPositionSetters: setVectorPoint[];
  private value: boolean;
  private valueSetters: ((value: boolean, propagate?: boolean) => void)[];
  private renderChange: React.Dispatch<React.SetStateAction<boolean>> | null;

  constructor(
    centre: Coordinate,
    // vectorPositionSetters: setVectorPoint[] = []
    value: boolean = false
  ) {
    this.centre = centre;
    this.vectorPositionSetters = [];
    this.value = value;
    this.valueSetters = [];
    this.setValue = this.setValue.bind(this);
    this.pushValueSetter = this.pushValueSetter.bind(this);
    this.renderChange = null;
    this.bindRender = this.bindRender.bind(this);
  }
  pushSetter(setVectorPoint: setVectorPoint) {
    this.vectorPositionSetters.push(setVectorPoint);
  }
  pushValueSetter(setterFn: (_value: boolean) => void) {
    this.valueSetters.push(setterFn);
  }
  bindRender(dispatch: React.Dispatch<React.SetStateAction<boolean>>) {
    this.renderChange = dispatch;
  }
  getCentre() {
    return this.centre;
  }
  getValue() {
    return this.value;
  }
  setValue = (value: boolean, propagate: boolean = true) => {
    this.value = value;
    if (propagate) {
      this.valueSetters.forEach((setter) => {
        setter(value, false);
        console.log(this.value);
        if (this.renderChange) {
          this.renderChange(value);
        }
      });
    }
  };

  render() {
    return (
      <Point2
        center={this.centre}
        vectorPositionSetters={this.vectorPositionSetters}
        value={this.value}
        setValue={this.setValue}
        pointValueSetter={this.setValue}
        bindRender={this.bindRender}
      />
    );
  }
}

export default PrototypePoint;
