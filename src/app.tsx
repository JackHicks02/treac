import { createContext, useContext, useRef } from "react";
import Menu from "./components/UI/Menu";
import { JemContextProvider } from "./utils/JemStore";
import { tabsDict } from "./utils/TabsDict";
import Tab from "./components/UI/Tab";
import { MousePositionProvider } from "./utils/MousePositionContext";
import GateStyleProvider from "./utils/StyleContext";

export type Coordinate = [number, number];

export type PointWithID = { id: string; point: JSX.Element };

const MenuContext =
  createContext<React.MutableRefObject<HTMLDivElement | null> | null>(null);

export const useMenuContext = () => {
  return useContext(MenuContext);
};

function App() {
  const menuRef = useRef<null | HTMLDivElement>(null);

  return (
    <MenuContext.Provider value={menuRef}>
      <JemContextProvider
        contextKey="tab"
        defaultValue={Object.keys(tabsDict)[4]}
      >
        <MousePositionProvider>
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
                overflow: "hidden",
              }}
            >
              <Menu ref={menuRef} />
              <MousePositionProvider>
                <div
                  style={{
                    position: "relative",
                    paddingRight: "8px",
                    paddingTop: "8px",
                    paddingLeft: "8px",
                    overflow: "hidden",
                  }}
                >
                  <Tab />
                </div>
              </MousePositionProvider>
            </div>
          </GateStyleProvider>
        </MousePositionProvider>
      </JemContextProvider>
    </MenuContext.Provider>
  );
}

export default App;