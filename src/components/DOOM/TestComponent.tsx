import { FC, useState, useEffect } from "react";
import { ChildSetter, State } from "./Objectionable";

interface TestComponentProps {
  bindSetterFn: (_childSetter: ChildSetter) => void;
  setterFn: (newState: State) => void;
  getState: () => State;
  x: number;
  y: number;
}

const TestComponent: FC<TestComponentProps> = ({
  bindSetterFn,
  setterFn,
  getState,
  x,
  y,
}) => {
  const [myState, setMyState] = useState<State>({
    borderColour: "blue",
    backgroundColor: "black",
  });

  useEffect(() => {
    bindSetterFn(setMyState);
  }, []);

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
        style={{ padding: "10px", border: `1px solid ${myState.borderColour}` }}
      >
        disaster in bound!
      </div>
      <div style={{ padding: "10px", border: "1px solid red" }}>
        <button onClick={() => setterFn({ borderColour: "green" })}></button>
      </div>
    </div>
  );
};

export default TestComponent;
