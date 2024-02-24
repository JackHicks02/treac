import { ReactNode, createContext, useContext } from "react";
import { Coordinate } from "../../App";
import { BitLine, BitNode, NAND, OR, XOR } from "../Squidward/Gates";
import SquareVector from "../Squidward/SquareVector";

export const nodeContext = createContext<Map<JSX.Element, Coordinate>>(
  new Map<JSX.Element, Coordinate>()
);
const nodePositions = new Map<JSX.Element, Coordinate>([]);

export const useNodeContext = () => {
  const nodePositions = useContext(nodeContext);
  return nodePositions;
};

export const NodeContext = ({ children }: { children: ReactNode }) => {
  return (
    <nodeContext.Provider value={nodePositions}>
      {children}
    </nodeContext.Provider>
  );
};

const NAND2GATES = () => {
  const ALine = new BitLine();
  const BLine = new BitLine();
  const CLine = new BitLine();

  const a = (
    <NAND
      position={[100, 64]}
      ALine={ALine}
      BLine={BLine}
      CLine={CLine}
      label="NAND"
      nodePositions={nodePositions}
    />
  );

  const b = (
    <XOR ALine={ALine} BLine={BLine} CLine={CLine} position={[350, 350]} />
  );

  const startNode = <BitNode CLine={ALine} position={[50, 50]} />;

  return (
    <div id="test">
      <p
        style={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%,0)",
        }}
      >
        <strong>Implementation of Elementary Gates, using NAND Gates</strong>
      </p>
      <BitNode CLine={ALine} position={[50, 50]} />
      <BitNode CLine={BLine} position={[50, 84]} />

      <NAND
        position={[100, 64]}
        ALine={ALine}
        BLine={BLine}
        CLine={CLine}
        label="NAND"
        nodePositions={nodePositions}
        selfReference={a}
      />

      <XOR
        ALine={ALine}
        BLine={BLine}
        CLine={CLine}
        position={[350, 350]}
        nodePositions={nodePositions}
        selfReference={b}
      />
      <SquareVector
        bitLine={ALine}
        origin={[50, 50]}
        destination={nodePositions.get(a) ?? [0, 0]}
        originNode={startNode}
        destinationNode={b}
        nodeMap={nodePositions}
      />
    </div>
  );
};

export default NAND2GATES;
