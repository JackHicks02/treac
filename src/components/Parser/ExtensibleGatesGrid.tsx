import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStyle } from "../../utils/useStyle";
import {
  useNLineMount,
  useOneLineMount,
  useTwoLineMount,
  useUnaryMount,
} from "../../utils/utils";
import { Coordinate } from "../../app";
import { BitLine } from "../Squidward/Gates";
import {
  BitInOut,
  Dictionary,
  InOrOut,
  Side,
  SideInput,
  boolFunc,
  nFunc,
  unFunc,
} from "../../types/types";
import { gateStyle } from "../../utils/StyleContext";
import { useRender } from "../../utils/useRender";
import { GridItem } from "./Json2Grid";
const centre = { transform: "translate(-50%,-50%)" };

interface DryNodeProps {
  colour: string;
  width: number;
  position: Coordinate;
  className?: string;
}
const DryNode: FC<DryNodeProps> = ({ colour, width, position, className }) => {
  return (
    <div
      className={className ?? ""}
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
        className={CLine.getBit() ? "rainbow" : ""}
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

interface NGate {
  label: string;
  keyID: string;
  ins: [Side, string, BitLine][];
  outs: [Side, string, BitLine][];
  positionObj: Dictionary<GridItem>;
  position: GridItem;
  grid: GridItem[][];
  func: nFunc;
}

export const NGate: FC<NGate> = ({
  position,
  ins,
  outs,
  positionObj,
  grid,
  keyID,
  func,
  label,
}) => {
  const style = useStyle()[0];
  const dimensions = useRef({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const rawDims = useRef({
    width: 4,
    height: 4,
  });
  //Severe brain rot limitation
  //you break these up before passing them in so there's no way you can have ins and outs on the same side
  //in the order they come in, outs will always be pushed to the end
  //call it a feature!

  const inLines = ins.map((inLine) => inLine[2].getBit());
  const DryNodes = useRef<JSX.Element[]>([]);

  const c = func(inLines);
  const allOutputsTrue = c.every((value) => value);

  const combinedInAndOut: BitInOut[] = [
    ...ins.map((inLine) => ["in", inLine[2]] as BitInOut),
    ...outs.map((outLine) => ["out", outLine[2]] as BitInOut),
  ];

  useNLineMount(combinedInAndOut, c);

  useMemo(() => {
    ins.forEach(
      (inLine) =>
        (dimensions.current[inLine[0]] = dimensions.current[inLine[0]] + 1)
    );
    outs.forEach(
      (outLine) =>
        (dimensions.current[outLine[0]] = dimensions.current[outLine[0]] + 1)
    );
  }, []);

  useMemo(() => {
    rawDims.current.width = Math.max(
      dimensions.current.top,
      dimensions.current.bottom,
      4
    ); // this is horribly unoptimised, you repeat this below
    rawDims.current.height = Math.max(
      dimensions.current.left,
      dimensions.current.right,
      4
    );
  }, []);

  const calculateBreadth = useCallback(
    (firstSide: number, secondSide: number) => {
      const rawBreadth = Math.max(firstSide, secondSide);

      if (rawBreadth < 3) {
        return 4 * GridItem.gap;
      }

      return rawBreadth * 2 * GridItem.gap;
    },
    []
  );

  const width = useMemo(
    () => calculateBreadth(dimensions.current.top, dimensions.current.bottom),
    []
  );
  const height = useMemo(
    () => calculateBreadth(dimensions.current.left, dimensions.current.right),
    []
  );

  useMemo(() => {
    let [leftIndex, rightIndex, topIndex, bottomIndex] = [0, 0, 0, 0];

    const getGeneralOffset = (side: Side) => {
      if (side === "left" || side === "right") {
        if (dimensions.current[side] + 2 < rawDims.current.height) {
          return Math.floor(
            (rawDims.current.height - dimensions.current[side]) / 2
          );
        }
        return 0;
      }

      if (dimensions.current[side] + 2 < rawDims.current.width) {
        return Math.floor(
          (rawDims.current.width - dimensions.current[side]) / 2
        );
      }
      return 0;
    };

    const leftOffset = getGeneralOffset("left");
    const rightOffset = getGeneralOffset("right");
    const topOffset = getGeneralOffset("top");
    const bottomOffset = getGeneralOffset("bottom");

    ins.forEach((inLine) => {
      //This whole thing is awful
      let x = position.x;
      let y = position.y;

      switch (inLine[0]) {
        case "left":
          y = y + 2 * leftIndex + 1 + leftOffset;
          positionObj[`${keyID}left${leftIndex}`] = grid[x][y];
          DryNodes.current.push(
            <BitNode
              positionObj={positionObj}
              keyID={`${keyID}left${leftIndex}`}
              position={grid[x][y]}
              CLine={inLine[2]}
            /> //This not being dry => an unescessary re render?
          );
          leftIndex++;
          break;
        case "right":
          x += rawDims.current.width + rightOffset;
          y += 2 * rightIndex + 1;
          positionObj[`${keyID}right${rightIndex}`] = grid[x][y];
          DryNodes.current.push(
            <BitNode
              positionObj={positionObj}
              keyID={`${keyID}right${rightIndex}`}
              position={grid[x][y]}
              CLine={inLine[2]}
            />
          );
          rightIndex++;
          break;
        case "top":
          x += 2 * topIndex + 1 + topOffset;
          positionObj[`${keyID}top${topIndex}`] = grid[x][y];
          DryNodes.current.push(
            <BitNode
              positionObj={positionObj}
              keyID={`${keyID}top${topIndex}`}
              position={grid[x][y]}
              CLine={inLine[2]}
            />
          );
          topIndex++;
          break;
        case "bottom":
          x += 2 * bottomIndex + 1 + bottomOffset;
          y += rawDims.current.height;
          positionObj[`${keyID}bottom${bottomIndex}`] =
            grid[x][height / GridItem.gap];
          DryNodes.current.push(
            <BitNode
              positionObj={positionObj}
              keyID={`${keyID}bottom${bottomIndex}`}
              position={grid[x][y]}
              CLine={inLine[2]}
            />
          );
          bottomIndex++;
          break;
      }
    });
    outs.forEach((outLine) => {
      let x = position.x;
      let y = position.y;

      switch (outLine[0]) {
        case "left":
          y += 2 * leftIndex + 1 + leftOffset;
          positionObj[`${keyID}left${leftIndex}`] = grid[x][y];
          DryNodes.current.push(
            <BitNode
              positionObj={positionObj}
              keyID={`${keyID}left${leftIndex}`}
              position={grid[x][y]}
              CLine={outLine[2]}
            />
          );
          leftIndex++;
          break;
        case "right":
          x += rawDims.current.width;
          y += 2 * rightIndex + 1 + rightOffset;
          positionObj[`${keyID}right${rightIndex}`] = grid[x][y];
          DryNodes.current.push(
            <BitNode
              positionObj={positionObj}
              keyID={`${keyID}right${rightIndex}`}
              position={grid[x][y]}
              CLine={outLine[2]}
            />
          );
          rightIndex++;
          break;
        case "top":
          x += 2 * topIndex + 1 + topOffset;
          positionObj[`${keyID}top${topIndex}`] = grid[x][y];
          DryNodes.current.push(
            <BitNode
              positionObj={positionObj}
              keyID={`${keyID}top${topIndex}`}
              position={grid[x][y]}
              CLine={outLine[2]}
            />
          );
          topIndex++;
          break;
        case "bottom":
          x += 2 * bottomIndex + 1 + bottomOffset;
          y += rawDims.current.height;
          positionObj[`${keyID}bottom${bottomIndex}`] = grid[x][y];
          DryNodes.current.push(
            <BitNode
              positionObj={positionObj}
              keyID={`${keyID}bottom${bottomIndex}`}
              position={grid[x][y]}
              CLine={outLine[2]}
            />
          );
          bottomIndex++;
          break;
      }
    });
  }, []);

  //whole thing rainbow if all outs are true?
  return (
    <>
      <div
        className={allOutputsTrue ? "rainbow-border" : ""}
        style={{
          position: "absolute",
          left: position.getCoords()[0],
          top: position.getCoords()[1],
          width: width,
          height: height,
          border: "1px solid",
          borderColor: allOutputsTrue ? style.defaultOn : style.defaultOff,
          borderRadius: "4px",
          transform: "translate(-1px,-1px)", // border offset :^/,
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

        {/* <DryNode
        className={a ? "rainbow" : ""}
        width={style.nodeWidth}
        colour={a ? style.defaultOn : style.defaultOff}
        position={[0, 1 * GridItem.gap]}
      /> */}
        {/* <DryNode
        className={b ? "rainbow" : ""}
        width={style.nodeWidth}
        colour={b ? style.defaultOn : style.defaultOff}
        position={[0, 3 * GridItem.gap]}
      />
      <DryNode
        className={c ? "rainbow" : ""}
        width={style.nodeWidth}
        colour={c ? style.defaultOn : style.defaultOff}
        position={[4 * GridItem.gap, 2 * GridItem.gap]}
      /> */}
      </div>
      {DryNodes.current}
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
    positionObj[`${keyID}A`] = grid[position.x][position.y + 1];
    positionObj[keyID + "B"] = grid[position.x][position.y + 3];
    positionObj[keyID] = grid[position.x + 4][position.y + 2];
  }, []);

  if (!position) {
    return <></>;
  } //This is worth keeping rather than enforcing so hidden logic can be carried out etc

  return (
    <div
      className={c ? "rainbow-border" : ""}
      style={{
        position: "absolute",
        left: position.getCoords()[0],
        top: position.getCoords()[1],
        width: GridItem.gap * 4,
        height: GridItem.gap * 4,
        border: "1px solid",
        borderColor: c ? style.defaultOn : style.defaultOff,
        borderRadius: "4px",
        transform: "translate(-1px,-1px)", // border offset :^/,
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
        className={a ? "rainbow" : ""}
        width={style.nodeWidth}
        colour={a ? style.defaultOn : style.defaultOff}
        position={[0, 1 * GridItem.gap]}
      />
      <DryNode
        className={b ? "rainbow" : ""}
        width={style.nodeWidth}
        colour={b ? style.defaultOn : style.defaultOff}
        position={[0, 3 * GridItem.gap]}
      />
      <DryNode
        className={c ? "rainbow" : ""}
        width={style.nodeWidth}
        colour={c ? style.defaultOn : style.defaultOff}
        position={[4 * GridItem.gap, 2 * GridItem.gap]}
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
  const isOn = bitLine.getBit();
  const style = useStyle()[0];

  useOneLineMount(bitLine);

  const midX = (_origin.getCoords()[0] + _destination.getCoords()[0]) / 2;
  const height = Math.abs(_destination.getCoords()[1] - _origin.getCoords()[1]);
  const direction =
    _destination.getCoords()[1] > _origin.getCoords()[1] ? 1 : -1;
  const bgColour: string = bitLine.getBit() ? style.vectorOn : style.vectorOff;

  return (
    <>
      <div
        className={isOn ? "rainbow" : ""}
        style={{
          transform: "translateY(-50%)",
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
        className={isOn ? "rainbow" : ""}
        style={{
          transform: "translate(-50%)",
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
        className={isOn ? "rainbow" : ""}
        style={{
          transform: "translateY(-50%)",
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
