import { FC, useEffect } from "react";
import { Coordinate } from "../../App";
import { BitLine } from "./Gates";
import { useRender } from "../../utils/useRender";
import { useOneLineMount } from "../../utils/utils";

interface SquareVectorProps {
  origin: Coordinate;
  destination: Coordinate;
  bitLine: BitLine;
}

const SquareVectorStyle = {
  backgroundColor: "white",
};

const ColoursDict = new Map<boolean, string>([
  [true, "rgba(0,0,255,0.75)"],
  [false, "rgba(255,255,255,.25)"],
]);

const thickness = 2;

const SquareVector: FC<SquareVectorProps> = ({
  origin,
  destination,
  bitLine,
}) => {
  useOneLineMount(bitLine);

  const midX = (origin[0] + destination[0]) / 2;
  const height = Math.abs(destination[1] - origin[1]);
  const direction = destination[1] > origin[1] ? 1 : -1;
  const bgColour: string = ColoursDict.get(bitLine.getBit()) ?? "red";

  return (
    <>
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: origin[0],
          top: origin[1],
          height: thickness,
          width: Math.abs(midX - origin[0]) + thickness,
        }}
      />
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: midX,
          top: direction === 1 ? origin[1] : destination[1], // Adjust top position based on direction
          height: height,
          width: thickness,
        }}
      />
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: midX,
          top: destination[1],
          height: thickness,
          width: Math.abs(destination[0] - midX),
        }}
      />
    </>
  );
};

export default SquareVector;
