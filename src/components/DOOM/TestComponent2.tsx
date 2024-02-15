import { FC, useState, useEffect } from "react";
import { ChildSetter, State } from "./Objectionable2";

interface TestComponentProps {
  bindSetterFn: (_childSetter: ChildSetter) => void;
  setterFn: (boolean: boolean) => void;
  getState: () => State;
  x: number;
  y: number;
  name: string;
}

const TestComponent2: FC<TestComponentProps> = ({
  bindSetterFn,
  setterFn,
  getState,
  x,
  y,
  name,
}) => {
  const [render, makeRender] = useState<boolean>(false);
  bindSetterFn(makeRender);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        color: "white",
      }}
    >
      <div
        style={{
          padding: "10px",
          border: `1px solid ${getState().borderColour}`,
        }}
      >
        {name}
      </div>
      <div style={{ padding: "10px", border: "1px solid red" }}>
        <button onClick={() => setterFn(!render)} />
      </div>
    </div>
  );
};

export default TestComponent2;
