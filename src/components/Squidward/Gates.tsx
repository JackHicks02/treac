import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useRender } from "../../utils/useRender";
import { removeElement, useTwoLineMount } from "../../utils/utils";
import { Coordinate } from "../../App";
import { useStyle } from "../../utils/useStyle";

const centre = { transform: "translate(-50%,-50%)" };

export type BitLineListener = () => void;

export class BitLine {
  private bit: boolean;
  private BitLineListeners: BitLineListener[] = [];

  constructor(defaultValue?: boolean) {
    this.bit = defaultValue ?? false;
  }

  setBit = (
    value: boolean | ((arg: boolean) => boolean),
    callSetters: boolean = true
  ) => {
    if (value === this.bit) {
      return;
    }

    if (typeof value == "boolean") {
      this.bit = value;
    } else {
      this.bit = value(this.bit);
    }

    callSetters && this.callSetters();
  };

  getBit = (): boolean => {
    return this.bit;
  };

  pushSetter = (setter: () => void) => {
    this.BitLineListeners.push(setter);
  };

  removeSetter = (setter: () => void) => {
    removeElement(this.BitLineListeners, setter);
  };

  private callSetters = () => {
    this.BitLineListeners.forEach((setter) => setter());
  };
}

export type BitNodeProps = {
  CLine: BitLine;
  position?: Coordinate;
  label?: string;
};

export type OneLineProps = BitNodeProps & {
  ALine: BitLine;
};

export type TwoLineProps = BitNodeProps & {
  ALine: BitLine;
  BLine: BitLine;
  nodePositions?: Map<JSX.Element, Coordinate>;
  selfReference?: JSX.Element;
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
        color: "red",
        zIndex: 4,
        fontSize: 20,
        backgroundColor: "rgb(0,0,0,0.75)",
      }}
    >
      <strong>{children}</strong>
    </div>
  );
};

interface DryNodeProps {
  colour: string;
  width: number;
  position: Coordinate;
  left: string;
  top: string;
}
const DryNode: FC<DryNodeProps> = ({ colour, width, left, top }) => {
  return (
    <div
      style={{
        ...centre,
        position: "absolute",
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: colour,
        left: left,
        top: top,
      }}
    />
  );
};

export const NOT: FC<OneLineProps> = ({ position, CLine, ALine }) => {
  const render = useRender();

  useEffect(() => {
    ALine.pushSetter(render);
    return () => {
      ALine.removeSetter(render);
    };
  }, []);

  CLine.setBit((prev) => !prev);

  return <></>;
};

export const OR: FC<TwoLineProps> = ({
  position,
  CLine,
  ALine,
  BLine,
  nodePositions,
  selfReference,
}) => {
  const [a, b] = [ALine.getBit(), BLine.getBit()];

  const c = a || b;

  useTwoLineMount(ALine, BLine, CLine, c);

  return <></>;
};

export const AND: FC<TwoLineProps> = ({ position, CLine, ALine, BLine }) => {
  const [a, b] = [ALine.getBit(), BLine.getBit()];

  const c = a && b;
  useTwoLineMount(ALine, BLine, CLine, c);

  return <></>;
};

export const XOR: FC<TwoLineProps> = ({
  position = [0, 0],
  CLine,
  ALine,
  BLine,
  nodePositions,
  selfReference,
}) => {
  const [a, b] = [ALine.getBit(), BLine.getBit()];

  const c = (a || b) && !(a && b);
  useTwoLineMount(ALine, BLine, CLine, c);

  useEffect(() => {
    if (nodePositions && selfReference) {
      nodePositions.delete(selfReference);
      nodePositions.set(selfReference, position);
    }

    return () => {
      if (nodePositions && selfReference) {
        nodePositions.delete(selfReference);
      }
    };
  }, []);

  return <Label position={position}>XOR</Label>;
};

export const NAND: FC<TwoLineProps> = ({
  position,
  CLine,
  ALine,
  BLine,
  nodePositions,
  selfReference,
}) => {
  const [a, b] = [ALine.getBit(), BLine.getBit()];
  const c = !(a && b);

  const style = useStyle()[0];
  useTwoLineMount(ALine, BLine, CLine, c);

  useEffect(() => {
    if (nodePositions && selfReference) {
      nodePositions.delete(selfReference);
      nodePositions.set(selfReference, [500, 500]);
    }

    return () => {
      if (nodePositions && selfReference) {
        nodePositions.delete(selfReference);
      }
    };
  }, []);

  if (!position) {
    return <></>;
  } //This is worth keeping rather than enforcing so hidden logic can be carried out etc

  return (
    <div
      style={{
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
        position={[0, 0]}
        left="0"
        top={`calc(${style.nodeWidth})`}
      />
      <DryNode
        width={style.nodeWidth}
        colour={b ? style.defaultOn : style.defaultOff}
        position={[0, 0]}
        left=""
        top="80%"
      />
    </div>
  );
};

export const BitNode: FC<BitNodeProps> = ({ CLine, position, label }) => {
  const [centre, setMyCentre] = useState<Coordinate>(position ?? [0, 0]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const render = useRender();

  const divRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    CLine.setBit(!CLine.getBit());
    setIsDraggable((prevState) => !prevState);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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
          left: centre[0],
          top: centre[1],
          height: "12px",
          width: "12px",
          transform: "translate(-50%, -50%)",
          backgroundColor: CLine.getBit() ? "blue" : "white",
          borderRadius: "12px",
        }}
        onClick={handleClick}
      />
      {label && position && (
        <Label position={[position[0] - 12, position[1] + 6]}>{label}</Label>
      )}
    </>
  );
};
