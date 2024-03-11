import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Menu from "./components/UI/Menu";
import { JemContextProvider } from "./utils/JemStore";
import { Nand2Infinity, tabsDict } from "./utils/TabsDict";
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
  const [rainbow, setRainbow] = useState(false);
  const menuRef = useRef<null | HTMLDivElement>(null);

  const handleRainbow = useCallback((e: KeyboardEvent) => {
    if (e.key === "r") {
      setRainbow((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keypress", handleRainbow);

    return () => window.addEventListener("keypress", handleRainbow);
  }, []);

  return (
    <>
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
      {rainbow && (
        <style>
          {`
          @keyframes rainbow-static {
            0% {border-color: red;}
            14% {border-color: orange;}
            28% {border-color: yellow;}
            42% {border-color: green;}
            56% {border-color: blue;}
            70% {border-color: indigo;}
            84% {border-color: violet;}
            100% {border-color: red;}
          }
          
          .rainbow-border {
            border: 4px solid; /* Adjust based on your preferences */
            animation: rainbow-static 8s linear infinite;
          }
          
          @keyframes rainbow-static-background {
            0% {background-color: red;}
            14% {background-color: orange;}
            28% {background-color: yellow;}
            42% {background-color: green;}
            56% {background-color: blue;}
            70% {background-color: indigo;}
            84% {background-color: violet;}
            100% {background-color: red;}
          }

          .rainbow{
            animation: rainbow-static-background 8s linear infinite;
          }
        `}
        </style>
      )}
    </>
  );
}

export default App;
