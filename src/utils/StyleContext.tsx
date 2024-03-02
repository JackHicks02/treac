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
  gateWidth: 60,
  defaultOff: "white",
  defaultOn: "rgb(225, 0, 255)",
  vectorThickness: 2,
  vectorOn: "rgba(255,0,255,0.75)",
  vectorOff: "rgba(255,255,255,.25)",
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
