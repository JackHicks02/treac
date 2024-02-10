import { FC, createContext, useContext, useRef, useEffect } from "react";

interface MousePositionContextProps {
  children: React.ReactNode;
}

interface MousePosition {
  x: number;
  y: number;
}

const MousePositionContext =
  createContext<React.MutableRefObject<MousePosition | null> | null>(null);

export const useMouseContext = () => {
  return useContext(MousePositionContext);
};

const MousePositionProvider: FC<MousePositionContextProps> = ({ children }) => {
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <MousePositionContext.Provider value={mousePositionRef}>
      {children}
    </MousePositionContext.Provider>
  );
};

export default MousePositionProvider;
