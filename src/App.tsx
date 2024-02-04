import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Vector from "./components/Vector";
import Point from "./components/Point";
import MousePositionProvider from "./components/MousePositionContext";
import PointVector from "./components/PointVector";
import { prototype } from "events";
import PrototypePoint from "./components/PrototypePoint";
import PrototypeVector from "./components/PrototypeVector";

export type Coordinate = [number, number];

export type PointWithID = { id: string; point: JSX.Element };

function App() {
  const a = <Point center={[200, 200]} />;
  const b = <Point center={[300, 300]} />;
  const c = <Point center={[400, 400]} />;

  const myPointA = new PrototypePoint([150, 100]);
  const myPointB = new PrototypePoint([550, 500]);
  const myPointC = new PrototypePoint([600, 600]);

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
        {a}
        {b}
        {c}
        <PointVector pointA={a} pointB={b} />
        <PointVector pointA={b} pointB={c} />
        {myPointA.render()}
        {myPointB.render()}
        {myPointC.render()}
        <PrototypeVector pointA={myPointA} pointB={myPointB} />
        <PrototypeVector pointA={myPointB} pointB={myPointC} />
      </div>
    </MousePositionProvider>
  );
}

export default App;
