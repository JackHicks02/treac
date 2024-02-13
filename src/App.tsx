import React from "react";
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

export type Coordinate = [number, number];

export type PointWithID = { id: string; point: JSX.Element };

function App() {
  const myPointA = new PrototypePoint([150, 100]);
  const myPointB = new PrototypePoint([550, 500]);

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

        <PrototypeVector pointA={myPointA} pointB={myPointB} />
      </div>
    </MousePositionProvider>
  );
}

export default App;
