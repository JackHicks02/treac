import { Coordinate } from "../../App";

import Point2 from "./Point2";
import { setVectorPoint } from "./PointVector";

class PrototypePoint {
  private centre: Coordinate;
  private vectorPositionSetters: setVectorPoint[];
  private value: boolean;

  constructor(
    centre: Coordinate,
    // vectorPositionSetters: setVectorPoint[] = []
    value: boolean = false
  ) {
    this.centre = centre;
    this.vectorPositionSetters = [];
    this.value = value;
  }
  pushSetter(setVectorPoint: setVectorPoint) {
    this.vectorPositionSetters.push(setVectorPoint);
  }
  // pushValueSetter
  getCentre() {
    return this.centre;
  }
  getValue() {
    return this.value;
  }
  setValue(value: boolean) {
    this.value = value;
  }

  render() {
    return (
      <Point2
        center={this.centre}
        vectorPositionSetters={this.vectorPositionSetters}
        value={this.value}
      />
    );
  }
}

export default PrototypePoint;
