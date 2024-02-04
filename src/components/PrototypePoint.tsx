import { Coordinate } from "../App";

import Point2 from "./Point2";
import { setVectorPoint } from "./PointVector";

class PrototypePoint {
  private centre: Coordinate;
  private vectorPositionSetters: setVectorPoint[];

  constructor(
    centre: Coordinate
    // vectorPositionSetters: setVectorPoint[] = []
  ) {
    this.centre = centre;
    this.vectorPositionSetters = [];
  }

  pushSetter(setVectorPoint: setVectorPoint) {
    this.vectorPositionSetters.push(setVectorPoint);
  }

  getCentre() {
    return this.centre;
  }
  render() {
    return (
      <Point2
        center={this.centre}
        vectorPositionSetters={this.vectorPositionSetters}
      />
    );
  }
}

export default PrototypePoint;
