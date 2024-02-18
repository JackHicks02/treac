import { FC, useEffect, useRef, useState } from "react";
import { useRender } from "../../utils/useRender";
import { Coordinate } from "../../App";
import {
  removeElement,
  removeElementFromMany,
  useTwoLineMount,
} from "../../utils/utils";

type BitObj = { bit: boolean };
type BitLineListener = () => void;
class BitLine {
  //Make new BitObj and Listener arr
  private BitObj: BitObj = { bit: false };
  private BitLineListeners: BitLineListener[] = [];

  constructor(defaultValue?: boolean) {
    this.BitObj = { bit: defaultValue ?? false };
  }

  LineWithListener: LineWithListener = {
    bitLine: this.BitObj,
    bitLineListeners: this.BitLineListeners,
  };
}

//This is probably unesccesarily slow even if it is more reusable
// const and = (a: boolean, b: boolean) => {
//   return a && b;
// };

// const or = (a: boolean, b: boolean) => {
//   return a || b;
// };

// const not = (a: boolean) => {
//   return !a;
// };

// Ask dem what to do here, whether this shouldn't exist and should just be replaced with the class (or something else entirely)?
export type LineWithListener = {
  bitLine: BitObj;
  bitLineListeners: BitLineListener[];
};

type BitNodeProps = {
  CLine: LineWithListener;
  position: Coordinate;
};

type OneLineProps = BitNodeProps & {
  ALine: LineWithListener;
};

type TwoLineProps = BitNodeProps & {
  ALine: LineWithListener;
  BLine: LineWithListener;
  //CLine is inherited from BitNodeProps <- LineListener ?
};

const NOT: FC<OneLineProps> = ({ position, CLine, ALine }) => {
  const render = useRender();
  const a = ALine.bitLine.bit;
  const b = !a;

  useEffect(() => {
    const _setter = render;
    ALine.bitLineListeners.push(_setter);
    return () => {
      removeElement<() => void>(ALine.bitLineListeners, _setter);
      //TS is properly inferring ()=>void so won't write it after
    };
  }, []);

  CLine.bitLine.bit = b;
  CLine.bitLineListeners.forEach((listener) => listener());

  return (
    <div
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
      }}
    >
      NOT
    </div>
  );
};

const OR: FC<TwoLineProps> = ({ position, CLine, ALine, BLine }) => {
  const render = useRender();
  const a = ALine.bitLine.bit;
  const b = BLine.bitLine.bit;
  const c = a || b;

  useEffect(() => {
    ALine.bitLineListeners.push(render);
    BLine.bitLineListeners.push(render);

    return () => {
      removeElementFromMany(
        [ALine.bitLineListeners, BLine.bitLineListeners],
        render
      );
    };
  }, []);

  CLine.bitLine.bit = c;
  CLine.bitLineListeners.forEach((listener) => listener());

  return (
    <div
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
      }}
    >
      OR
    </div>
  );
};

const AND: FC<TwoLineProps> = ({ position, CLine, ALine, BLine }) => {
  const a = ALine.bitLine.bit;
  const b = BLine.bitLine.bit;
  const c = a && b;

  useTwoLineMount(ALine, BLine);

  //If the state isn't going to change, do not propogate it as it's unesccessary
  if (CLine.bitLine.bit !== c) {
    CLine.bitLine.bit = c;
    CLine.bitLineListeners.forEach((listener) => listener());
  }

  return (
    <div
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
      }}
    >
      AND
    </div>
  );
};

const BitNode: FC<BitNodeProps> = ({ CLine, position }) => {
  const render = useRender();

  useEffect(() => {
    CLine.bitLineListeners.push(render);

    return () => {
      removeElement(CLine.bitLineListeners, render);
    };
  }, []);

  const handleClick = () => {
    CLine.bitLine.bit = !CLine.bitLine.bit;
    CLine.bitLineListeners.forEach((render) => {
      render();
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
        height: "12px",
        width: "12px",
        backgroundColor: CLine.bitLine.bit ? "blue" : "white",
        borderRadius: "12px",
      }}
      onClick={handleClick}
    />
  );
};

const Squidward = () => {
  const bitLineA = new BitLine();
  const bitLineB = new BitLine();
  const bitLineC = new BitLine();
  const bitLineZ = new BitLine();
  // const bitLineListenersA: (() => void)[] = [];
  // const bitLineListenersB: (() => void)[] = [];
  // const bitLineListenersC: (() => void)[] = [];
  // const bitLineListenersZ: (() => void)[] = [];

  const bitLineA1 = new BitLine();
  const bitLineB1 = new BitLine();
  const bitLineC1 = new BitLine();
  // const bitLineListenersA1: (() => void)[] = [];
  // const bitLineListenersB1: (() => void)[] = [];
  // const bitLineListenersC1: (() => void)[] = [];

  const bitLineA2 = new BitLine();
  // const bitLineListenersA2: (() => void)[] = [];
  const bitLineB2 = new BitLine();
  // const bitLineListenersB2: (() => void)[] = [];

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <BitNode CLine={bitLineA.LineWithListener} position={[500, 500]} />
      <BitNode CLine={bitLineB.LineWithListener} position={[500, 600]} />
      <AND
        position={[600, 550]}
        CLine={bitLineC.LineWithListener}
        ALine={bitLineA.LineWithListener}
        BLine={bitLineB.LineWithListener}
      />
      <BitNode CLine={bitLineC.LineWithListener} position={[650, 554]} />

      <NOT
        CLine={bitLineZ.LineWithListener}
        position={[700, 550]}
        ALine={bitLineC.LineWithListener}
      />
      <BitNode CLine={bitLineZ.LineWithListener} position={[750, 554]} />

      <BitNode CLine={bitLineA1.LineWithListener} position={[500, 800]} />

      <BitNode CLine={bitLineB1.LineWithListener} position={[500, 700]} />
      <OR
        CLine={bitLineC1.LineWithListener}
        position={[600, 750]}
        ALine={bitLineA1.LineWithListener}
        BLine={bitLineB1.LineWithListener}
      />
      <BitNode CLine={bitLineC1.LineWithListener} position={[650, 754]} />

      <BitNode CLine={bitLineA2.LineWithListener} position={[500, 400]} />
      <NOT
        CLine={bitLineB2.LineWithListener}
        position={[600, 400]}
        ALine={bitLineA2.LineWithListener}
      />
      <BitNode CLine={bitLineB2.LineWithListener} position={[650, 404]} />
    </div>
  );
};

export default Squidward;
