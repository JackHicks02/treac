import { FC, cloneElement, useEffect, useRef } from "react";
import { Coordinate } from "../App";
import { PointProps } from "./Point";
import Vector from "./Vector";
import PrototypePoint from "./PrototypePoint";

export type setVectorPoint = null | React.Dispatch<
  React.SetStateAction<Coordinate>
>;

export type setVectorPointRef = React.MutableRefObject<setVectorPoint>;

interface PrototypePointVectorProps {
  pointA: PrototypePoint;
  pointB: PrototypePoint;
}

const PrototypeVector: FC<PrototypePointVectorProps> = ({ pointA, pointB }) => {
  // const pointACoordinatesRef = useRef<Coordinate>([0, 0]);
  // const pointBCoordinatesRef = useRef<Coordinate>([0, 0]);

  const setVectorOriginRef = useRef<setVectorPoint>(null);
  const setVectorDestinationRef = useRef<setVectorPoint>(null);

  // console.log("props", pointA.props);

  useEffect(() => {
    pointA.pushSetter(setVectorOriginRef.current);
    pointB.pushSetter(setVectorDestinationRef.current);
  }, []);

  return (
    <>
      <Vector
        origin={pointA.getCentre()}
        destination={pointB.getCentre()}
        setVectorOriginRef={setVectorOriginRef}
        setVectorDestinationRef={setVectorDestinationRef}
      />
    </>
  );
};

export default PrototypeVector;
