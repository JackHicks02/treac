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
    bob: {
      elementName: "nand",
      elementProps: {
        position: [90, 50],
        A: "a",
        B: "a",
      },
    },
    out: {
      elementName: "node",
      elementProps: {
        position: [180, 50],
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
    // not: {
    //   elementName: "unarygate",
    //   elementProps: {
    //     A: "nand",
    //     position: [220, 50],
    //     label: "NOT",
    //   },
    //   func: (a: boolean) => !a,
    // },
    nand2: {
      elementName: "nand",
      elementProps: {
        position: [220, 50],
        A: "nand",
        B: "nand",
      },
    },
    out: {
      elementName: "node",
      elementProps: {
        position: [300, 50],
        label: "Out",
      },
      connect: "nand2",
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
    nand1: {
      elementName: "nand",
      elementProps: {
        position: [100, 70],
        A: "a",
        B: "a",
      },
    },
    nand2: {
      elementName: "nand",
      elementProps: {
        A: "b",
        B: "b",
        position: [100, 210],
      },
    },
    nand: {
      elementName: "nand",
      elementProps: {
        A: "nand1",
        B: "nand2",
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

  const XOR: JsonGateDict = {
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

    splitNand: {
      elementName: "nand",
      elementProps: {
        position: [120, 140],
        A: "a",
        B: "b",
      },
    },
    aNand: {
      elementName: "nand",
      elementProps: {
        position: [260, 80],
        A: "a",
        B: "splitNand",
      },
    },
    bNand: {
      elementName: "nand",
      elementProps: {
        position: [260, 200],
        A: "splitNand",
        B: "b",
      },
    },
    outNand: {
      elementName: "nand",
      elementProps: {
        position: [360, 140],
        A: "aNand",
        B: "bNand",
      },
    },
    out: {
      elementName: "node",
      elementProps: {
        position: [460, 140],
        label: "Out",
      },
      connect: "outNand",
    },
  };

  const MUX: JsonGateDict = {
    a: {
      elementName: "node",
      elementProps: {
        position: [0, 40],
        label: "A",
      },
    },
    s: {
      elementName: "node",
      elementProps: {
        position: [0, 140],
        label: "S",
      },
    },
    s2: {
      elementName: "node",
      elementProps: {
        position: [90, 220],
      },
      connect: "s",
    },
    b: {
      elementName: "node",
      elementProps: {
        position: [0, 240],
        label: "B",
      },
    },
    sNand: {
      elementName: "nand",
      elementProps: {
        position: [120, 140],
        A: "s",
        B: "s",
      },
    },
    aNand: {
      elementName: "nand",
      elementProps: {
        position: [240, 50],
        A: "a",
        B: "sNand",
      },
    },
    bNand: {
      elementName: "nand",
      elementProps: {
        position: [240, 230],
        A: "s2",
        B: "b",
      },
    },
    outNand: {
      elementName: "nand",
      elementProps: {
        position: [360, 140],
        A: "aNand",
        B: "bNand",
      },
    },
    out: {
      elementName: "node",
      elementProps: {
        position: [460, 140],
      },
      connect: "outNand",
    },
  };

  const DEMUX: JsonGateDict = {
    a: {
      elementName: "node",
      elementProps: {
        position: [0, 40],
        label: "In",
      },
    },
    a2: {
      elementName: "node",
      elementProps: {
        position: [0, 240],
      },
      connect: "a",
    },
    s: {
      elementName: "node",
      elementProps: {
        position: [20, 140],
        label: "s",
      },
    },
    s2: {
      elementName: "node",
      elementProps: {
        position: [60, 140],
      },
      connect: "s",
    },
    s3: {
      elementName: "node",
      elementProps: {
        position: [60, 220],
      },
      connect: "s2",
    },
    sNot: {
      elementName: "nand",
      elementProps: {
        position: [120, 140],
        A: "s2",
        B: "s2",
      },
    },
    aNand: {
      elementName: "nand",
      elementProps: {
        position: [240, 50],
        A: "a",
        B: "sNot",
      },
    },
    bNand: {
      elementName: "nand",
      elementProps: {
        position: [240, 230],
        A: "s3",
        B: "a2",
      },
    },
    aNandOut: {
      elementName: "node",
      elementProps: {
        position: [300, 95],
      },
      connect: "aNand",
    },
    bNandOut: {
      elementName: "node",
      elementProps: {
        position: [300, 185],
      },
      connect: "bNand",
    },
    nandA: {
      elementName: "nand",
      elementProps: {
        position: [380, 95],
        A: "aNandOut",
        B: "aNandOut",
      },
    },
    nandB: {
      elementName: "nand",
      elementProps: {
        position: [380, 185],
        A: "bNandOut",
        B: "bNandOut",
      },
    },
    outA: {
      elementName: "node",
      elementProps: {
        position: [460, 95],
      },
      connect: "nandA",
    },
    outB: {
      elementName: "node",
      elementProps: {
        position: [460, 185],
      },
      connect: "nandB",
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
              width: 180,
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
              width: 460,
              height: 280,
            }}
          >
            <Json2Gates dict={XOR} />
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
          XOR
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
              width: 460,
              height: 280,
            }}
          >
            <Json2Gates dict={MUX} />
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
          MUX
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
              width: 460,
              height: 280,
            }}
          >
            <Json2Gates dict={DEMUX} />
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
          DEMUX
        </div>
      </div>
    </div>
  );
};

export default NAND2GATES;
