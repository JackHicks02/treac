import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Vector from "./components/Vector";
import Point from "./components/Point";
import MousePositionProvider from "./components/MousePositionContext";
import PointVector from "./components/PointVector";

export type Coordinate = [number, number];

function App() {
  const a = <Point center={[200, 200]} />;
  const b = <Point center={[300, 300]} />;

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

        <PointVector pointA={a} pointB={b} />
      </div>
    </MousePositionProvider>
  );
}

export default App;
