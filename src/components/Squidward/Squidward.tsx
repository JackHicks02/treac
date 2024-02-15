import { FC, useEffect, useRef, useState } from "react";
import { useRender } from "../../utils/useRender";
import { Coordinate } from "../../App";

type BitObj = { bit: boolean };
type BitLineListener = () => void;
class Bitline {}

const and = (a: boolean, b: boolean) => {
  return a && b;
};

const or = (a: boolean, b: boolean) => {
  return a || b;
};

const not = (a: boolean) => {
  return !a;
};

type LineListener = {
  bitLine: BitObj;
  bitLineListeners: BitLineListener[];
};

type BitNodeProps = LineListener & {
  position: Coordinate;
};

type OneLineProps = BitNodeProps & {
  ALine: LineListener;
};

type TwoLineProps = BitNodeProps & {
  ALine: LineListener;
  BLine: LineListener;
  //CLine is inherited from BitNodeProps <- LineListener ?
};

const NOT: FC<OneLineProps> = ({
  bitLine,
  position,
  bitLineListeners,
  ALine,
}) => {
  const render = useRender();
  const a = ALine.bitLine.bit;
  const b = !a;

  useEffect(() => {
    ALine.bitLineListeners.push(render);
    //TODO: These all need to be removed on unmount
  }, []);

  bitLine.bit = b;
  bitLineListeners.forEach((listener) => listener());

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

const OR: FC<TwoLineProps> = ({
  bitLine,
  position,
  bitLineListeners,
  ALine,
  BLine,
}) => {
  const render = useRender();
  const a = ALine.bitLine.bit;
  const b = BLine.bitLine.bit;
  const c = a || b;

  useEffect(() => {
    ALine.bitLineListeners.push(render);
    BLine.bitLineListeners.push(render);
    //bitLineListeners.push(render);
    //TODO: These all need to be removed on unmount
  }, []);

  bitLine.bit = c;
  bitLineListeners.forEach((listener) => listener());

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

const AND: FC<TwoLineProps> = ({
  bitLine,
  position,
  bitLineListeners,
  ALine,
  BLine,
}) => {
  const render = useRender();
  const a = ALine.bitLine.bit;
  const b = BLine.bitLine.bit;
  const c = a && b;

  useEffect(() => {
    ALine.bitLineListeners.push(render);
    BLine.bitLineListeners.push(render);
    //bitLineListeners.push(render);
    //TODO: These all need to be removed on unmount
  }, []);

  bitLine.bit = c;
  bitLineListeners.forEach((listener) => listener());

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

const BitNode: FC<BitNodeProps> = ({ bitLine, bitLineListeners, position }) => {
  const render = useRender();

  useEffect(() => {
    bitLineListeners.push(render);

    return () => {
      const renderIndex = bitLineListeners.indexOf(render);
      bitLineListeners.splice(renderIndex, 1);
    };
  }, []);

  const handleClick = () => {
    bitLine.bit = !bitLine.bit;
    bitLineListeners.forEach((render) => render());
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
        height: "12px",
        width: "12px",
        backgroundColor: bitLine.bit ? "blue" : "white",
        borderRadius: "12px",
      }}
      onClick={handleClick}
    />
  );
};

const Squidward = () => {
  const bitLineA = { bit: false };
  const bitLineB = { bit: false };
  const bitLineC = { bit: false };
  const bitLineListenersA: (() => void)[] = [];
  const bitLineListenersB: (() => void)[] = [];
  const bitLineListenersC: (() => void)[] = [];

  const bitLineA1 = { bit: false };
  const bitLineB1 = { bit: false };
  const bitLineC1 = { bit: false };
  const bitLineListenersA1: (() => void)[] = [];
  const bitLineListenersB1: (() => void)[] = [];
  const bitLineListenersC1: (() => void)[] = [];

  const bitLineA2 = { bit: false };
  const bitLineListenersA2: (() => void)[] = [];
  const bitLineB2 = { bit: false };
  const bitLineListenersB2: (() => void)[] = [];

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <BitNode
        bitLine={bitLineA}
        position={[500, 500]}
        bitLineListeners={bitLineListenersA}
      />
      <BitNode
        bitLine={bitLineB}
        position={[500, 600]}
        bitLineListeners={bitLineListenersB}
      />
      <AND
        bitLine={bitLineC}
        bitLineListeners={bitLineListenersC}
        position={[600, 550]}
        ALine={{ bitLine: bitLineA, bitLineListeners: bitLineListenersA }}
        BLine={{ bitLine: bitLineB, bitLineListeners: bitLineListenersB }}
      />
      <BitNode
        bitLine={bitLineC}
        bitLineListeners={bitLineListenersC}
        position={[650, 554]}
      />

      <BitNode
        bitLine={bitLineA1}
        position={[500, 800]}
        bitLineListeners={bitLineListenersA1}
      />
      <BitNode
        bitLine={bitLineB1}
        position={[500, 700]}
        bitLineListeners={bitLineListenersB1}
      />
      <OR
        bitLine={bitLineC1}
        bitLineListeners={bitLineListenersC1}
        position={[600, 750]}
        ALine={{ bitLine: bitLineA1, bitLineListeners: bitLineListenersA1 }}
        BLine={{ bitLine: bitLineB1, bitLineListeners: bitLineListenersB1 }}
      />
      <BitNode
        bitLine={bitLineC1}
        bitLineListeners={bitLineListenersC1}
        position={[650, 754]}
      />

      <BitNode
        bitLine={bitLineA2}
        position={[500, 400]}
        bitLineListeners={bitLineListenersA2}
      />
      <NOT
        bitLine={bitLineB2}
        bitLineListeners={bitLineListenersB2}
        position={[600, 400]}
        ALine={{ bitLine: bitLineA2, bitLineListeners: bitLineListenersA2 }}
      />
      <BitNode
        bitLine={bitLineB2}
        bitLineListeners={bitLineListenersB2}
        position={[650, 404]}
      />
    </div>
  );
};

export default Squidward;
