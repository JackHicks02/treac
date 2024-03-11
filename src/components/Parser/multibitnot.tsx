import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BitLine } from "../Squidward/Gates";
import { Coordinate, useMenuContext } from "../../app";
import {
  NAND,
  SquareVectorFromObj,
  BitNode,
  BinaryGate,
  UnaryGate,
  NGate,
} from "./ExtensibleGatesGrid";
import {
  Dictionary,
  JsonGateDict,
  ElementArray,
  unFunc,
  nFunc,
  Side,
} from "../../types/types";
import { GridItem, xy } from "./Json2Grid";

const Json2Elements = (
  JSON: JsonGateDict,
  bitLineObj: Dictionary<BitLine>,
  positionObj: Dictionary<GridItem>,
  grid: GridItem[][]
): ElementArray => {
  const ElementArray: ElementArray = [];

  const findConnection = (key: string, currentNode: string): BitLine | null => {
    if (bitLineObj[key]) {
      return bitLineObj[key];
    }

    try {
      if (JSON[key].connect) {
        return findConnection(JSON[key].connect!, currentNode);
      } else {
        return null;
      }
    } catch {
      const err = `Error, Missing connection @ ${currentNode}`;
      throw new Error(err);
    }
  };

  Object.keys(JSON).forEach((_key) => {
    const entry = JSON[_key];

    switch (entry.elementName) {
      case "node":
        positionObj[_key] = entry.elementProps.position;

        let CLine = !entry.connect ? new BitLine() : bitLineObj[entry.connect]!;

        if (!entry.connect) {
          bitLineObj[_key] = CLine;
        } else {
          ElementArray.push(
            <SquareVectorFromObj
              key={""}
              positionObj={positionObj}
              bitLine={CLine}
              originKey={entry.connect}
              destinationKey={_key}
            />
          );
        }
        ElementArray.unshift(
          <BitNode
            positionObj={positionObj}
            key={_key}
            keyID={_key}
            CLine={CLine}
            position={entry.elementProps.position}
            {...entry.elementProps}
          />
        );
        break;
      case "nand":
        bitLineObj[_key] = new BitLine(
          !(
            findConnection(entry.elementProps.A, _key)!.getBit() &&
            findConnection(entry.elementProps.B, _key)!.getBit()
          )
        );

        ElementArray.unshift(
          <NAND
            key={_key}
            keyID={_key}
            CLine={bitLineObj[_key]}
            ALine={findConnection(entry.elementProps.A, _key)!}
            BLine={findConnection(entry.elementProps.B, _key)!}
            positionObj={positionObj}
            position={entry.elementProps.position}
            grid={grid}
          />
        );

        ElementArray.push(
          <SquareVectorFromObj
            key={_key + "A"}
            positionObj={positionObj}
            originKey={entry.elementProps.A}
            destinationKey={_key + "A"}
            bitLine={findConnection(entry.elementProps.A, _key)!}
          />
        );
        ElementArray.push(
          <SquareVectorFromObj
            key={_key + "B"}
            positionObj={positionObj}
            originKey={entry.elementProps.B}
            destinationKey={_key + "B"}
            bitLine={findConnection(entry.elementProps.B, _key)!}
          />
        );
        break;

      case "custom":
        const nodes = entry.elementProps.nodes as [Side, string][];
        const label = entry.elementProps.label as string;
        const func = entry.elementProps.func as nFunc;
        const position = entry.elementProps.position as GridItem;

        const insWithLine: [Side, string, BitLine][] = []; // the non line ones dont need to be passed or the outs don't need to have lines
        const outsWithLine: [Side, string, BitLine][] = [];

        let outCount = 0;
        nodes.forEach((node) => {
          if (node[1] === "out") {
            bitLineObj[_key + node[0] + outCount] = new BitLine();
            outsWithLine.push([...node, bitLineObj[_key + node[0] + outCount]]);
            outCount++;
          } else {
            insWithLine.push([...node, findConnection(node[1], _key)!]);
          }
        });

        outsWithLine.forEach((node) => (bitLineObj[node[0]] = new BitLine()));

        ElementArray.unshift(
          <NGate
            label={label}
            keyID={_key}
            ins={insWithLine}
            outs={outsWithLine}
            positionObj={positionObj}
            position={position}
            grid={grid}
            func={func}
          />
        );

        //pass this in later to reduce some of the fat horrible mess
        const dimensions = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        };

        insWithLine.forEach((inLine) => {
          //  positionObj[`${keyID}Left${leftIndex}`] = grid[x][y];
          ElementArray.push(
            <SquareVectorFromObj
              key={_key + inLine[0] + dimensions[inLine[0]] + "vec"}
              positionObj={positionObj}
              originKey={inLine[1]}
              destinationKey={_key + inLine[0] + dimensions[inLine[0]]}
              bitLine={findConnection(inLine[1], _key)!}
            />
          );
          dimensions[inLine[0]] = dimensions[inLine[0]] + 1;
        });

        // outsWithLine.forEach((outLine) => {
        //   ElementArray.push(
        //     <SquareVectorFromObj
        //       key={_key + outLine[0] + dimensions[outLine[0]] + "vec"}
        //       positionObj={positionObj}
        //       originKey={outLine[1]}
        //       destinationKey={_key + outLine[0] + dimensions[outLine[0]]}
        //       bitLine={findConnection(outLine[1], _key)!}
        //     />
        //   );
        //   dimensions[outLine[0]] = dimensions[outLine[0]] + 1;
        // });
        break;

      default:
        throw new Error(`No component by the name of ${entry.elementName}`);
    }
  });
  return ElementArray;
};

interface Json2GatesProps {
  dict?: JsonGateDict;
  width?: number;
  height?: number;
}

const MultiBitNot: FC<Json2GatesProps> = ({ dict, width, height }) => {
  const [grid, setGrid] = useState<GridItem[][]>([]);
  const [gridSize, _setGridSize] = useState({
    width: width ?? 200,
    height: height ?? 200,
  });
  const [testDict, setTestDict] = useState<JsonGateDict>({});
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const modifiedDictRef = useRef<JsonGateDict>({});
  const xOffset = useRef<number>(0);
  const menuRef = useMenuContext();

  const bitLineObj: Dictionary<BitLine> = {};
  const positionObj: Dictionary<GridItem> = {};

  useEffect(() => {
    xOffset.current = (menuRef?.current?.clientWidth ?? 0) + 16;

    const _grid = [];
    for (let i = 0; i < gridSize.width; i++) {
      const row = [];
      for (let j = 0; j < gridSize.height; j++) {
        row.push(new GridItem(i, j));
      }
      _grid.push(row);
    }
    setGrid(_grid);

    setTestDict(
      dict ?? {
        in1: {
          elementName: "node",
          elementProps: {
            position: xy(1, 3, _grid),
          },
        },
        not1: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 1, _grid),
            nodes: [
              ["left", "in1"], //this should be type checked in dimensions, had "Left" instead of "left" before and no error
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out1: {
          elementName: "node",
          elementProps: {
            position: xy(9, 3, _grid),
          },
          connect: "not1right0",
        },

        in2: {
          elementName: "node",
          elementProps: {
            position: xy(1, 10, _grid),
          },
        },
        not2: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 8, _grid),
            nodes: [
              ["left", "in2"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out2: {
          elementName: "node",
          elementProps: {
            position: xy(9, 10, _grid),
          },
          connect: "not2right0",
        },

        in3: {
          elementName: "node",
          elementProps: {
            position: xy(1, 17, _grid),
          },
        },
        not3: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 15, _grid),
            nodes: [
              ["left", "in3"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out3: {
          elementName: "node",
          elementProps: {
            position: xy(9, 17, _grid),
          },
          connect: "not3right0",
        },
        in4: {
          elementName: "node",
          elementProps: {
            position: xy(1, 24, _grid),
          },
        },
        not4: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 22, _grid),
            nodes: [
              ["left", "in4"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out4: {
          elementName: "node",
          elementProps: {
            position: xy(9, 24, _grid),
          },
          connect: "not4right0",
        },
        in5: {
          elementName: "node",
          elementProps: {
            position: xy(1, 31, _grid),
          },
        },
        not5: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 29, _grid),
            nodes: [
              ["left", "in5"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out5: {
          elementName: "node",
          elementProps: {
            position: xy(9, 31, _grid),
          },
          connect: "not5right0",
        },

        in6: {
          elementName: "node",
          elementProps: {
            position: xy(1, 38, _grid),
          },
        },
        not6: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 36, _grid),
            nodes: [
              ["left", "in6"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out6: {
          elementName: "node",
          elementProps: {
            position: xy(9, 38, _grid),
          },
          connect: "not6right0",
        },

        in7: {
          elementName: "node",
          elementProps: {
            position: xy(1, 45, _grid),
          },
        },
        not7: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 43, _grid),
            nodes: [
              ["left", "in7"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out7: {
          elementName: "node",
          elementProps: {
            position: xy(9, 45, _grid),
          },
          connect: "not7right0",
        },

        in8: {
          elementName: "node",
          elementProps: {
            position: xy(1, 52, _grid),
          },
        },
        not8: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 50, _grid),
            nodes: [
              ["left", "in8"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out8: {
          elementName: "node",
          elementProps: {
            position: xy(9, 52, _grid),
          },
          connect: "not8right0",
        },
        in9: {
          elementName: "node",
          elementProps: {
            position: xy(1, 59, _grid),
          },
        },
        not9: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 57, _grid),
            nodes: [
              ["left", "in9"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out9: {
          elementName: "node",
          elementProps: {
            position: xy(9, 59, _grid),
          },
          connect: "not9right0",
        },

        in10: {
          elementName: "node",
          elementProps: {
            position: xy(1, 66, _grid),
          },
        },
        not10: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 64, _grid),
            nodes: [
              ["left", "in10"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out10: {
          elementName: "node",
          elementProps: {
            position: xy(9, 66, _grid),
          },
          connect: "not10right0",
        },

        in11: {
          elementName: "node",
          elementProps: {
            position: xy(1, 73, _grid),
          },
        },
        not11: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 71, _grid),
            nodes: [
              ["left", "in11"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out11: {
          elementName: "node",
          elementProps: {
            position: xy(9, 73, _grid),
          },
          connect: "not11right0",
        },

        in12: {
          elementName: "node",
          elementProps: {
            position: xy(1, 80, _grid),
          },
        },
        not12: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 78, _grid),
            nodes: [
              ["left", "in12"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out12: {
          elementName: "node",
          elementProps: {
            position: xy(9, 80, _grid),
          },
          connect: "not12right0",
        },

        in13: {
          elementName: "node",
          elementProps: {
            position: xy(1, 87, _grid),
          },
        },
        not13: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 85, _grid),
            nodes: [
              ["left", "in13"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out13: {
          elementName: "node",
          elementProps: {
            position: xy(9, 87, _grid),
          },
          connect: "not13right0",
        },

        in14: {
          elementName: "node",
          elementProps: {
            position: xy(1, 94, _grid),
          },
        },
        not14: {
          elementName: "custom",
          elementProps: {
            position: xy(3, 92, _grid),
            nodes: [
              ["left", "in14"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return [!inputs[0]];
            },
            label: "not",
          },
        },
        out14: {
          elementName: "node",
          elementProps: {
            position: xy(9, 94, _grid),
          },
          connect: "not14right0",
        },

        in15: {
          elementName: "node",
          elementProps: {
            position: xy(1, 101, _grid),
          },
        },

        a1: {
          elementName: "node",
          elementProps: {
            position: xy(20, 3, _grid),
          },
        },
        a2: {
          elementName: "node",
          elementProps: {
            position: xy(20, 5, _grid),
          },
        },
        a3: {
          elementName: "node",
          elementProps: {
            position: xy(20, 7, _grid),
          },
        },
        a4: {
          elementName: "node",
          elementProps: {
            position: xy(20, 9, _grid),
          },
        },
        a5: {
          elementName: "node",
          elementProps: {
            position: xy(20, 11, _grid),
          },
        },
        a6: {
          elementName: "node",
          elementProps: {
            position: xy(20, 13, _grid),
          },
        },
        a7: {
          elementName: "node",
          elementProps: {
            position: xy(20, 15, _grid),
          },
        },
        a8: {
          elementName: "node",
          elementProps: {
            position: xy(20, 17, _grid),
          },
        },
        a9: {
          elementName: "node",
          elementProps: {
            position: xy(20, 19, _grid),
          },
        },
        a10: {
          elementName: "node",
          elementProps: {
            position: xy(20, 21, _grid),
          },
        },
        a11: {
          elementName: "node",
          elementProps: {
            position: xy(20, 23, _grid),
          },
        },
        a12: {
          elementName: "node",
          elementProps: {
            position: xy(20, 25, _grid),
          },
        },
        a13: {
          elementName: "node",
          elementProps: {
            position: xy(20, 27, _grid),
          },
        },
        a14: {
          elementName: "node",
          elementProps: {
            position: xy(20, 29, _grid),
          },
        },
        a15: {
          elementName: "node",
          elementProps: {
            position: xy(20, 31, _grid),
          },
        },
        a16: {
          elementName: "node",
          elementProps: {
            position: xy(20, 33, _grid),
          },
        },
        bitNot16: {
          elementName: "custom",
          elementProps: {
            position: xy(26, 2, _grid),
            nodes: [
              ["left", "a1"],
              ["right", "out"],
              ["left", "a2"],
              ["right", "out"],
              ["left", "a3"],
              ["right", "out"],
              ["left", "a4"],
              ["right", "out"],
              ["left", "a5"],
              ["right", "out"],
              ["left", "a6"],
              ["right", "out"],
              ["left", "a7"],
              ["right", "out"],
              ["left", "a8"],
              ["right", "out"],
              ["left", "a9"],
              ["right", "out"],
              ["left", "a10"],
              ["right", "out"],
              ["left", "a11"],
              ["right", "out"],
              ["left", "a12"],
              ["right", "out"],
              ["left", "a13"],
              ["right", "out"],
              ["left", "a14"],
              ["right", "out"],
              ["left", "a15"],
              ["right", "out"],
              ["left", "a16"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              return inputs.map((input) => !input);
            },
            label: "not",
          },
        },
      }
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!dict || grid.length === 0) return; // Make sure we have a dictionary and a grid

    const updatedDict: JsonGateDict = {};
    Object.entries(dict).forEach(([key, gate]) => {
      if (gate.elementProps && Array.isArray(gate.elementProps.position)) {
        const [x, y] = gate.elementProps.position;
        updatedDict[key] = {
          ...gate,
          elementProps: {
            ...gate.elementProps,
            position: xy(x, y, grid), // Update the position
          },
        };
      } else {
        updatedDict[key] = gate; // Copy entry unchanged if no position array
      }
    });
    modifiedDictRef.current = updatedDict; // Store the updated dictionary in the ref
  }, [dict, grid]);

  const svgWidth = gridSize.width * GridItem.gap;
  const svgHeight = gridSize.height * GridItem.gap;

  const circuit = useMemo(
    () => Json2Elements(testDict, bitLineObj, positionObj, grid),
    [testDict]
  );

  const handleClick = (e: KeyboardEvent) => {
    if (e.key === "1") {
      setShowGrid((prev) => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleClick);
    //Jem this and the state later, mad lag

    return () => window.removeEventListener("keypress", handleClick);
  }, []);

  return loading ? (
    <div>Loading</div>
  ) : (
    <>
      {circuit}
      <div
        style={{
          position: "absolute",
          display: showGrid ? "block" : "none",
          width: svgWidth,
          height: svgHeight,
          backgroundSize: `${GridItem.gap}px ${GridItem.gap}px`,
          backgroundPosition: `${-0.5 * GridItem.gap}px ${
            -0.5 * GridItem.gap
          }px`,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Ccircle cx='6' cy='6' r='1' stroke='rgba(255,255,255,0.125)' stroke-width='1' fill='rgba(255,255,255,0.125)'/%3E%3C/svg%3E\")",
        }}
      ></div>
    </>
  );
};

export default MultiBitNot;
