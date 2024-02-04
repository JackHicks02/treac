import { FC, useEffect, useState } from "react";
import { Coordinate } from "../App";
import { setVectorPointRef } from "./PointVector";

interface VectorProps {
  origin: Coordinate;
  destination: Coordinate;
  setVectorOriginRef?: setVectorPointRef;
  setVectorDestinationRef?: setVectorPointRef;
}

const Vector: FC<VectorProps> = ({
  origin,
  destination,
  setVectorOriginRef,
  setVectorDestinationRef,
}) => {
  const [myOrigin, setMyOrigin] = useState<Coordinate>(origin);
  const [myDestination, setMyDestination] = useState<Coordinate>(destination);
  // console.log("my origin ", myOrigin);
  // console.log("My destination", myDestination);

  useEffect(() => {
    if (setVectorOriginRef && setVectorDestinationRef) {
      setVectorOriginRef.current = setMyOrigin;
      setVectorDestinationRef.current = setMyDestination;
    }
  }, []);

  const width: number = 2;
  const length: number = Math.sqrt(
    (myDestination[0] - myOrigin[0]) ** 2 +
      (myDestination[1] - myOrigin[1]) ** 2
  );

  const angle = Math.atan2(
    myDestination[1] - myOrigin[1],
    myDestination[0] - myOrigin[0]
  );

  const adjustedAngle = angle - Math.PI / 2;

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "white",
        width: width,
        height: length,
        left: myOrigin[0],
        top: myOrigin[1],
        transform: `rotate(${adjustedAngle}rad) translate(-50%,0)`,
        transformOrigin: "top left",
      }}
    ></div>
  );
};

export default Vector;
