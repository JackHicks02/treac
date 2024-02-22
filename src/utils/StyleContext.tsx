import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export const gateStyle = {
  nodeWidth: 12,
  gateWidth: 64,
  defaultOff: "white",
  defaultOn: "blue",
};

export type GateStyle = typeof gateStyle;

export const GateStyleConext = createContext<
  [GateStyle, Dispatch<SetStateAction<GateStyle>>]
>([gateStyle, () => {}]);

interface GateStyleProviderProps {
  children: ReactNode;
}

const GateStyleProvider: FC<GateStyleProviderProps> = ({ children }) => {
  const [gateStyleState, setGateStyleState] = useState<GateStyle>(gateStyle);

  return (
    <GateStyleConext.Provider value={[gateStyleState, setGateStyleState]}>
      {children}
    </GateStyleConext.Provider>
  );
};

export default GateStyleProvider;
