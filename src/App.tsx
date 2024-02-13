import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Vector from "./components/ProtoTypes/Vector";
import Point from "./components/ProtoTypes/Point";
import MousePositionProvider from "./components/ProtoTypes/MousePositionContext";
import PointVector from "./components/ProtoTypes/PointVector";
import { prototype } from "events";
import PrototypePoint from "./components/ProtoTypes/PrototypePoint";
import PrototypeVector from "./components/ProtoTypes/PrototypeVector";
import AND from "./components/Gates/And";
import Objectionable, {
  ChildSetter,
  State,
} from "./components/DOOM/Objectionable";

export type Coordinate = [number, number];

export type PointWithID = { id: string; point: JSX.Element };

interface TestComponentProps {
  bindSetterFn: (_childSetter: ChildSetter) => void;
  setterFn: (newState: State) => void;
  getState: () => State;
}

const TestComponent: FC<TestComponentProps> = ({
  bindSetterFn,
  setterFn,
  getState,
}) => {
  console.log(bindSetterFn);
  console.log(setterFn);

  console.log(getState());

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
        left: 500,
        top: 500,
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

const test = new Objectionable({});

function App() {
  const myPointA = new PrototypePoint([150, 100]);
  const myPointB = new PrototypePoint([550, 500]);

  console.log(test);
  console.log(test.getState());

  return (
    <MousePositionProvider>
      <div
        style={{
          backgroundColor: "black",
          width: "100vw",
          height: "100vh",
          position: "relative",
          cursor: "crosshair",
        }}
      >
        {/* <Vector origin={[10, 10]} destination={[40, 40]} />
        <Vector origin={[90, 60]} destination={[180, 62]} />
        <Point center={[10, 10]} />
        <Point center={[40, 40]} />
        <Point center={[90, 60]} />
        <Point center={[180, 62]} /> */}

        {myPointA.render()}
        {myPointB.render()}
        {/* {test.render()} */}
        <TestComponent
          setterFn={test.setState}
          bindSetterFn={test.bindChildSetter}
          getState={test.getState}
        />
        <div></div>
        <PrototypeVector pointA={myPointA} pointB={myPointB} />
      </div>
    </MousePositionProvider>
  );
}

export default App;
