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
import TestComponent from "./components/DOOM/TestComponent";

export type Coordinate = [number, number];

export type PointWithID = { id: string; point: JSX.Element };

const test = new Objectionable({});
const test2 = new Objectionable({});
const test3 = new Objectionable({});
const test4 = new Objectionable({});
test2.pushSetter(test.setState);

function App() {
  const myPointA = new PrototypePoint([150, 100]);
  const myPointB = new PrototypePoint([550, 500]);

  console.log(test);
  console.log(test.getState());

  return (
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
        x={500}
        y={500}
      />

      <TestComponent
        setterFn={test2.setState}
        bindSetterFn={test2.bindChildSetter}
        getState={test2.getState}
        x={900}
        y={500}
      />
      <PrototypeVector pointA={myPointA} pointB={myPointB} />
    </div>
  );
}

export default App;
