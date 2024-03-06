import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStyle } from "../../utils/useStyle";
import {
  useOneLineMount,
  useTwoLineMount,
  useUnaryMount,
} from "../../utils/utils";
import { Coordinate } from "../../app";
import { BitLine } from "../Squidward/Gates";
import { Dictionary, boolFunc, unFunc } from "../../types/types";
import { gateStyle } from "../../utils/StyleContext";
import { useRender } from "../../utils/useRender";
import { GridItem } from "./Json2Grid";
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

interface LabelProps {
  children: ReactNode;
  position: Coordinate;
}
const Label: FC<LabelProps> = ({ children, position }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
        color: "cyan",
        zIndex: 4,
        backgroundColor: "rgb(0,0,0,0.75)",
      }}
    >
      <strong>{children}</strong>
    </div>
  );
};

interface BitNodeProps {
  keyID: string;
  position: GridItem;
  positionObj: Dictionary<GridItem>;
  CLine: BitLine;
  label?: string;
}

export const BitNode: FC<BitNodeProps> = ({
  CLine,
  position,
  positionObj,
  label,
  keyID,
}) => {
  const [gridItem, setGridItem] = useState<GridItem>(position);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const render = useRender();
  const style = useStyle()[0];

  useMemo(() => {
    positionObj[keyID] = position;
  }, []);

  const handleClick = useCallback(() => {
    CLine.setBit(!CLine.getBit());
    setIsDraggable((prevState) => !prevState);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    CLine.pushSetter(render);

    return () => {
      CLine.removeSetter(render);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 3,
          left: gridItem.getCoords()[0],
          top: gridItem.getCoords()[1],
          height: "12px",
          width: "12px",
          transform: "translate(-50%, -50%)",
          backgroundColor: CLine.getBit() ? style.defaultOn : style.defaultOff,
          borderRadius: "12px",
        }}
        onClick={handleClick}
      />
      {label && position && (
        <Label
          position={[gridItem.getCoords()[0] - 12, gridItem.getCoords()[1] + 6]}
        >
          {label}
        </Label>
      )}
    </>
  );
};

interface NANDProps {
  keyID: string;
  CLine: BitLine;
  ALine: BitLine;
  BLine: BitLine;
  positionObj: Dictionary<GridItem>;
  position: GridItem;
  grid: GridItem[][];
}

export const NAND: FC<NANDProps> = ({
  position,
  CLine,
  ALine,
  BLine,
  positionObj,
  keyID,
  grid,
}): JSX.Element => {
  const style = useStyle()[0];

  const [a, b] = [ALine.getBit(), BLine.getBit()];
  const c = !(a && b);

  useTwoLineMount(ALine, BLine, CLine, c);

  useMemo(() => {
    positionObj[`${keyID}A`] = grid[position.x - 1][position.y - 1];
    positionObj[keyID + "B"] = grid[position.x - 2][position.y - 2];
    positionObj[keyID] = grid[position.x + 2][position.y];
  }, []);

  if (!position) {
    return <></>;
  } //This is worth keeping rather than enforcing so hidden logic can be carried out etc

  return (
    <div
      style={{
        ...centre,
        position: "absolute",
        left: position.getCoords()[0],
        top: position.getCoords()[1],
        width: style.gateWidth,
        height: style.gateWidth,
        border: "1px solid",
        borderColor: c ? style.defaultOn : style.defaultOff,
        borderRadius: "4px",
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
        <strong>NAND</strong>
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

interface BinaryGate {
  label: string;
  keyID: string;
  CLine: BitLine;
  ALine: BitLine;
  BLine: BitLine;
  positionObj: Dictionary<Coordinate>;
  position: Coordinate;
  func: boolFunc;
}

interface UnaryGate {
  label: string;
  keyID: string;
  CLine: BitLine;
  ALine: BitLine;
  positionObj: Dictionary<Coordinate>;
  position: Coordinate;
  func: unFunc;
}

export const UnaryGate: FC<UnaryGate> = ({
  position,
  CLine,
  ALine,
  positionObj,
  keyID,
  func,
  label,
}): JSX.Element => {
  const style = useStyle()[0];

  const a = ALine.getBit();
  const c = func(a);

  useUnaryMount(ALine, CLine, c);

  useMemo(() => {
    positionObj[`${keyID}A`] = [position[0] - style.gateWidth / 2, position[1]];
    positionObj[keyID] = [position[0] + gateStyle.gateWidth / 2, position[1]];
    console.log("Ungate posOB", positionObj);
  }, []);

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
        borderRadius: "4px",
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
        <strong>{label}</strong>
      </div>
      <DryNode
        width={style.nodeWidth}
        colour={a ? style.defaultOn : style.defaultOff}
        position={[0, gateStyle.gateWidth / 2]}
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

export const BinaryGate: FC<BinaryGate> = ({
  position,
  CLine,
  ALine,
  BLine,
  positionObj,
  keyID,
  func,
  label,
}): JSX.Element => {
  const style = useStyle()[0];

  const [a, b] = [ALine.getBit(), BLine.getBit()];
  const c = func(a, b);

  useTwoLineMount(ALine, BLine, CLine, c);

  useMemo(() => {
    positionObj[`${keyID}A`] = [
      position[0] - style.gateWidth / 2,
      position[1] + gateStyle.gateWidth / 3 - gateStyle.gateWidth / 2,
    ];
    positionObj[keyID + "B"] = [
      position[0] - style.gateWidth / 2,
      position[1] + (2 * gateStyle.gateWidth) / 3 - gateStyle.gateWidth / 2,
    ];
    positionObj[keyID] = [position[0] + gateStyle.gateWidth / 2, position[1]];
  }, []);

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
        borderRadius: "4px",
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
        <strong>{label}</strong>
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
  positionObj: Dictionary<GridItem>;
  bitLine: BitLine;
}

export const SquareVectorFromObj: FC<SquareVectorProps> = ({
  originKey,
  destinationKey,
  positionObj,
  bitLine,
}) => {
  const [_origin, _setOrigin] = useState(positionObj[originKey]);
  const [_destination, _setDestination] = useState(positionObj[destinationKey]);
  const style = useStyle()[0];

  useOneLineMount(bitLine);

  const midX = (_origin.getCoords()[0] + _destination.getCoords()[0]) / 2;
  const height = Math.abs(_destination.getCoords()[1] - _origin.getCoords()[1]);
  const direction =
    _destination.getCoords()[1] > _origin.getCoords()[0] ? 1 : -1;
  const bgColour: string = bitLine.getBit() ? style.vectorOn : style.vectorOff;

  return (
    <>
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: _origin.getCoords()[0],
          top: _origin.getCoords()[1],
          height: style.vectorThickness,
          width:
            Math.abs(midX - _origin.getCoords()[0]) + style.vectorThickness,
        }}
      />
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: midX,
          top:
            direction === 1
              ? _origin.getCoords()[1]
              : _destination.getCoords()[1],
          height: height,
          width: style.vectorThickness,
        }}
      />
      <div
        style={{
          backgroundColor: bgColour,
          position: "absolute",
          left: midX,
          top: _destination.getCoords()[1],
          height: style.vectorThickness,
          width: Math.abs(_destination.getCoords()[0] - midX),
        }}
      />
    </>
  );
};
