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
  const myPointA = new PrototypePoint([150, 100]);
  const myPointB = new PrototypePoint([550, 500]);
  const myPointC = new PrototypePoint([600, 600]);
  const myPointD = new PrototypePoint([1000, 100]);

  const myPointE = new PrototypePoint([1000, 200]);
  const myPointF = new PrototypePoint([1250, 300]);
  const myPointG = new PrototypePoint([1120, 200]);

  const myPointH = new PrototypePoint([900, 500]);
  const myPointI = new PrototypePoint([1000, 600]);
  const myPointJ = new PrototypePoint([1100, 700]);

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
        {myPointC.render()}
        {/* {myPointD.render()} */}
        <PrototypeVector pointA={myPointA} pointB={myPointB} />
        <PrototypeVector pointA={myPointB} pointB={myPointC} />
        <PrototypeVector pointA={myPointC} pointB={myPointA} />

        {myPointD.render()}
        {myPointE.render()}
        {myPointF.render()}
        {myPointG.render()}

        <PrototypeVector pointA={myPointD} pointB={myPointE} />
        <PrototypeVector pointA={myPointE} pointB={myPointF} />
        <PrototypeVector pointA={myPointE} pointB={myPointG} />

        {myPointH.render()}
        {myPointI.render()}
        {myPointJ.render()}

        <PrototypeVector pointA={myPointH} pointB={myPointI} />
        <PrototypeVector pointA={myPointI} pointB={myPointJ} />
      </div>
    </MousePositionProvider>
  );
}

export default App;
