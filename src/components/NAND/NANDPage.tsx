import { ReactNode, createContext, useContext } from "react";
import { Coordinate } from "../../App";
import { BitLine, BitNode, NAND, OR, XOR } from "../Squidward/Gates";
import SquareVector from "../Squidward/SquareVector";
import { JsonGateDict } from "../../types/types";
import Json2Gates from "../Parser/Json2Gates";

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

// const get percentage do some useEffect with div ref per grid item
// do spread calculation to import custom multistage gates and run maths on the adjustments for whatever
// use special chars like a...z and out.... for proper generic components from user end?

const NAND2GATES = () => {
  const NOT: JsonGateDict = {
    a: {
      elementName: "node",
      elementProps: { position: [0, 50], bs: 123, label: "In" }, // You can stick anything in here and typescript doesn't care unfortunately so this won't catch typos
    }, // Won't even warn the console
    b: {
      elementName: "node",
      elementProps: {
        position: [75, 30],
      },
      connect: "a",
    },
    c: {
      elementName: "node",
      elementProps: {
        position: [75, 70],
      },
      connect: "a",
    },
    bob: {
      elementName: "nand",
      elementProps: {
        position: [180, 50],
        A: "b",
        B: "c",
      },
    },
    out: {
      elementName: "node",
      elementProps: {
        position: [280, 50],
        label: "Out",
      },
      connect: "bob",
    },
  };

  const AND: JsonGateDict = {
    a: {
      elementName: "node",
      elementProps: {
        position: [0, 30],
        label: "A",
      },
    },
    b: {
      elementName: "node",
      elementProps: {
        position: [0, 70],
        label: "B",
      },
    },
    nand: {
      elementName: "binarygate",
      elementProps: {
        position: [100, 50],
        A: "a",
        B: "b",
        label: "NAND",
      },
      func: (a: boolean, b: boolean) => !(a && b),
    },
    not: {
      elementName: "unarygate",
      elementProps: {
        A: "nand",
        position: [220, 50],
        label: "NOT",
      },
      func: (a: boolean) => !a,
    },
    out: {
      elementName: "node",
      elementProps: {
        position: [300, 50],
        label: "Out",
      },
      connect: "not",
    },
  };

  const OR: JsonGateDict = {
    //w: 300
    //h: 280
    a: {
      elementName: "node",
      elementProps: {
        position: [0, 70],
        label: "A",
      },
    },
    b: {
      elementName: "node",
      elementProps: {
        position: [0, 210],
        label: "B",
      },
    },
    not1: {
      elementName: "unarygate",
      elementProps: {
        position: [100, 70],
        A: "a",
        label: "NOT",
      },
      func: (a: boolean) => !a,
    },
    not2: {
      elementName: "unarygate",
      elementProps: {
        A: "b",
        position: [100, 210],
        label: "NOT",
      },
      func: (a: boolean) => !a,
    },
    nand: {
      elementName: "nand",
      elementProps: {
        A: "not1",
        B: "not2",
        position: [200, 140],
      },
    },
    out: {
      elementName: "node",
      elementProps: {
        position: [300, 140],
        label: "Out",
      },
      connect: "nand",
    },
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        height: "100%",
        gap: "8px",
      }}
    >
      <div
        style={{
          border: "1px dashed white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 280,
              height: 100,
            }}
          >
            <Json2Gates dict={NOT} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px dashed white",
          }}
        >
          NOT
        </div>
      </div>
      <div
        style={{
          border: "1px dashed white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 280,
              height: 100,
            }}
          >
            <Json2Gates dict={AND} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px dashed white",
          }}
        >
          AND
        </div>
      </div>
      <div
        style={{
          border: "1px dashed white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              height: 280,
            }}
          >
            <Json2Gates dict={OR} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px dashed white",
          }}
        >
          OR
        </div>
      </div>
    </div>
  );
};

export default NAND2GATES;
