import { FC, cloneElement, useRef } from "react";
import { Coordinate } from "../../app";
import { PointProps } from "./Point";
import Vector from "./Vector";

export type setVectorPoint = null | React.Dispatch<
  React.SetStateAction<Coordinate>
>;

export type setVectorPointRef = React.MutableRefObject<setVectorPoint>;

interface PointVectorProps {
  pointA: JSX.Element;
  pointB: JSX.Element;
}

const PointVector: FC<PointVectorProps> = ({ pointA, pointB }) => {
  // const pointACoordinatesRef = useRef<Coordinate>([0, 0]);
  // const pointBCoordinatesRef = useRef<Coordinate>([0, 0]);

  const setVectorOriginRef = useRef<setVectorPoint>(null);
  const setVectorDestinationRef = useRef<setVectorPoint>(null);

  console.log("props", pointA.props);

  return (
    <>
      {cloneElement(pointA, {
        setVectorPointRef: setVectorOriginRef,
      })}
      <Vector
        origin={pointA.props.center}
        destination={pointB.props.center}
        setVectorOriginRef={setVectorOriginRef}
        setVectorDestinationRef={setVectorDestinationRef}
      />
      {cloneElement(pointB, {
        setVectorPointRef: setVectorDestinationRef,
      })}
    </>
  );
};

export default PointVector;
