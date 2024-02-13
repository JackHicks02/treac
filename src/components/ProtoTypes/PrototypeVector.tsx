import { FC, cloneElement, useEffect, useRef } from "react";
import { Coordinate } from "../../App";
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
  const setVectorOriginRef = useRef<setVectorPoint>(null);
  const setVectorDestinationRef = useRef<setVectorPoint>(null);

  useEffect(() => {
    pointA.pushSetter(setVectorOriginRef.current);
    pointB.pushSetter(setVectorDestinationRef.current);

    //get the set value function of both points and provide it to the other
    pointA.pushValueSetter(pointB.setValue);
    pointB.pushValueSetter(pointA.setValue);
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
