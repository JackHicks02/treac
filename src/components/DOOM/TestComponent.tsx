import { FC, useState, useEffect } from "react";
import { ChildSetter, State } from "./Objectionable";

interface TestComponentProps {
  bindSetterFn: (_childSetter: ChildSetter) => void;
  setterFn: (newState: State) => void;
  getState: () => State;
  x: number;
  y: number;
  name: string;
}

const TestComponent: FC<TestComponentProps> = ({
  bindSetterFn,
  setterFn,
  getState,
  x,
  y,
  name,
}) => {
  const [myState, setMyState] = useState<State>({
    borderColour: false,
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
        style={{
          padding: "10px",
          border: `1px solid ${myState.borderColour ? "green" : "blue"}`,
        }}
      >
        {name}
      </div>
      <div style={{ padding: "10px", border: "1px solid red" }}>
        <button
          onClick={() => setterFn({ borderColour: !myState.borderColour })}
        />
      </div>
    </div>
  );
};

export default TestComponent;
