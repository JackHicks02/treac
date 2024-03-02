import { createContext, ReactNode, RefObject, useRef } from "react";

interface MousePositionContextType {
  containerRef: RefObject<HTMLDivElement>;
}

export const MousePositionContext = createContext<
  MousePositionContextType | undefined
>(undefined);

export const MousePositionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <MousePositionContext.Provider value={{ containerRef }}>
      {children}
    </MousePositionContext.Provider>
  );
};
