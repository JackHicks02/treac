import { useLayoutEffect, useRef, useState } from "react";
import Menu from "./components/UI/Menu";
import { JemContextProvider } from "./utils/JemStore";
import { tabsDict } from "./utils/TabsDict";
import Tab from "./components/UI/Tab";
import { MousePositionProvider } from "./utils/MousePositionContext";
import GateStyleProvider from "./utils/StyleContext";

export type Coordinate = [number, number];

export type PointWithID = { id: string; point: JSX.Element };

function App() {
  return (
    <JemContextProvider contextKey="hello" defaultValue={0}>
      <JemContextProvider
        contextKey="tab"
        defaultValue={Object.keys(tabsDict)[0]}
      >
        <GateStyleProvider>
          <div
            style={{
              minWidth: "100vw",
              minHeight: "100vh",
              color: "white",
              backgroundColor: "black",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "8px",
            }}
          >
            <Menu />
            <MousePositionProvider>
              <div style={{ position: "relative" }}>
                <Tab />
              </div>
            </MousePositionProvider>
          </div>
        </GateStyleProvider>
      </JemContextProvider>
    </JemContextProvider>
  );
}

export default App;
