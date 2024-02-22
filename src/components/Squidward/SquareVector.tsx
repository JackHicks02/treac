import { FC, useEffect, useState } from "react";
import { Coordinate } from "../../App";
import { BitLine } from "./Gates";
import { useRender } from "../../utils/useRender";
import { useOneLineMount } from "../../utils/utils";
import { useNodeContext } from "../NAND/NANDPage";

interface SquareVectorProps {
  origin: Coordinate;
  destination: Coordinate;
  bitLine: BitLine;
  originNode?: JSX.Element;
  destinationNode?: JSX.Element;
  nodeMap?: Map<JSX.Element, Coordinate>;
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
  originNode,
  destinationNode,
  nodeMap,
}) => {
  const [_origin, setOrigin] = useState(origin);
  const [_destination, setDestination] = useState(destination);
  useOneLineMount(bitLine);

  useEffect(() => {
    if (nodeMap && originNode && destinationNode) {
      setOrigin(nodeMap.get(originNode) ?? origin);
      setDestination(nodeMap.get(destinationNode) ?? destination);
    }
  }, []);

  console.log(nodeMap);

  const midX = (_origin[0] + _destination[0]) / 2;
  const height = Math.abs(_destination[1] - _origin[1]);
  const direction = _destination[1] > _origin[1] ? 1 : -1;
  const bgColour: string = ColoursDict.get(bitLine.getBit()) ?? "red";

  return (
    <>
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: _origin[0],
          top: _origin[1],
          height: thickness,
          width: Math.abs(midX - _origin[0]) + thickness,
        }}
      />
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: midX,
          top: direction === 1 ? _origin[1] : _destination[1],
          height: height,
          width: thickness,
        }}
      />
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: midX,
          top: _destination[1],
          height: thickness,
          width: Math.abs(_destination[0] - midX),
        }}
      />
    </>
  );
};

export default SquareVector;
