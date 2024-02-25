import { FC, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useStyle } from "../../utils/useStyle";
import { useOneLineMount, useTwoLineMount } from "../../utils/utils";
import { Coordinate } from "../../App";
import { BitLine } from "../Squidward/Gates";
import { Dictionary } from "../../types/types";
import { gateStyle } from "../../utils/StyleContext";
const centre = { transform: "translate(-50%,-50%)" };
interface DryNodeProps {
  colour: string;
  width: number;
  position: Coordinate;
}
const DryNode: FC<DryNodeProps> = ({ colour, width, position }) => {
  return (
    <div
      style={{
        ...centre,
        position: "absolute",
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: colour,
        left: position[0],
        top: position[1],
      }}
    />
  );
};

interface NANDProps {
  keyID: string;
  CLine: BitLine;
  ALine: BitLine;
  BLine: BitLine;
  positionObj: Dictionary<Coordinate>;
  position: Coordinate;
}

export const NAND: FC<NANDProps> = ({
  position,
  CLine,
  ALine,
  BLine,
  positionObj,
  keyID,
}): JSX.Element => {
  const style = useStyle()[0];

  const [a, b] = [ALine.getBit(), BLine.getBit()];
  const c = !(a && b);

  useTwoLineMount(ALine, BLine, CLine, c);

  useMemo(() => {
    positionObj[`${keyID}A`] = [
      position[0] - style.gateWidth / 2,
      position[1] + gateStyle.gateWidth / 3 - gateStyle.gateWidth / 2,
    ];
    positionObj[keyID + "B"] = [
      position[0],
      position[1] + (2 * gateStyle.gateWidth) / 3,
    ];
    positionObj[keyID] = [
      position[0] + gateStyle.gateWidth + gateStyle.nodeWidth / 2,
      position[1] + gateStyle.gateWidth / 2,
    ];
  }, []);

  console.log("From NAND: ", positionObj);

  if (!position) {
    return <></>;
  } //This is worth keeping rather than enforcing so hidden logic can be carried out etc

  return (
    <div
      style={{
        ...centre,
        position: "absolute",
        left: position[0],
        top: position[1],
        width: style.gateWidth,
        height: style.gateWidth,
        border: "1px solid",
        borderColor: c ? style.defaultOn : style.defaultOff,
      }}
    >
      <div
        style={{
          ...centre,
          position: "absolute",
          left: "50%",
          top: "50%",
        }}
      >
        NAND
      </div>
      <DryNode
        width={style.nodeWidth}
        colour={a ? style.defaultOn : style.defaultOff}
        position={[0, gateStyle.gateWidth / 3]}
      />
      <DryNode
        width={style.nodeWidth}
        colour={b ? style.defaultOn : style.defaultOff}
        position={[0, (2 * gateStyle.gateWidth) / 3]}
      />
      <DryNode
        width={style.nodeWidth}
        colour={c ? style.defaultOn : style.defaultOff}
        position={[
          gateStyle.gateWidth + gateStyle.nodeWidth / 2,
          gateStyle.gateWidth / 2,
        ]}
      />
    </div>
  );
};

interface SquareVectorProps {
  originKey: string;
  destinationKey: string;
  positionObj: Dictionary<Coordinate>;
  bitLine: BitLine;
}

export const SquareVectorFromObj: FC<SquareVectorProps> = ({
  originKey,
  destinationKey,
  positionObj,
  bitLine,
}) => {
  const [_origin, setOrigin] = useState(positionObj[originKey]);
  const [_destination, setDestination] = useState(positionObj[destinationKey]);
  useOneLineMount(bitLine);
  const style = useStyle()[0];

  const midX = (_origin[0] + _destination[0]) / 2;
  const height = Math.abs(_destination[1] - _origin[1]);
  const direction = _destination[1] > _origin[1] ? 1 : -1;
  const bgColour: string = bitLine.getBit() ? style.vectorOn : style.vectorOff;

  return (
    <>
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: _origin[0],
          top: _origin[1],
          height: style.vectorThickness,
          width: Math.abs(midX - _origin[0]) + style.vectorThickness,
        }}
      />
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: midX,
          top: direction === 1 ? _origin[1] : _destination[1],
          height: height,
          width: style.vectorThickness,
        }}
      />
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: midX,
          top: _destination[1],
          height: style.vectorThickness,
          width: Math.abs(_destination[0] - midX),
        }}
      />
    </>
  );
};
