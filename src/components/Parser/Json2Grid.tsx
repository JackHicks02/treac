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

export class GridItem {
  public static readonly gap: number = 12;
  public readonly x: number;
  public readonly y: number;
  private coords: Coordinate;
  private owner: string | null;

  public getCoords = () => {
    return this.coords;
  };

  public setOwner = (name: string): void => {
    if (typeof this.owner) {
      this.owner = name;
    }
  };

  public constructor(x: number, y: number, owner = null) {
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.coords = [x * GridItem.gap, y * GridItem.gap];
  }

  public render = (): JSX.Element /*FC?*/ => {
    //Ideally this doesn't ever need calling
    return (
      <div
        key={this.coords.toString()}
        style={{
          position: "absolute",
          left: this.coords[0],
          top: this.coords[1],
          width: 4,
          height: 4,
          backgroundColor: "rgba(255,255,255,0.125)",
          borderRadius: 4,
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  };
}

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

        let CLine = !entry.connect
          ? new BitLine()
          : bitLineObj[entry.connect] ?? findConnection(entry.connect, _key);

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
          if (node[1] !== "out") {
            insWithLine.push([...node, findConnection(node[1], _key)!]);
          }
        });
        const defaults = func(insWithLine.map((inLine) => inLine[2].getBit()));
        console.log(
          "inbits: ",
          insWithLine.map((inLine) => inLine[2].getBit())
        );
        console.log(func);
        console.log("defaults: ", defaults);
        nodes.forEach((node) => {
          if (node[1] === "out") {
            bitLineObj[_key + node[0] + outCount] = new BitLine(
              defaults[outCount]
            );
            outsWithLine.push([...node, bitLineObj[_key + node[0] + outCount]]);
            outCount++;
          }
        });

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

export const xy = (x: number, y: number, _grid: GridItem[][]): GridItem =>
  _grid[x][y];

const Json2Grid: FC<Json2GatesProps> = ({ dict, width, height }) => {
  const [grid, setGrid] = useState<GridItem[][]>([]);
  const [gridSize, _setGridSize] = useState({
    width: width ?? 200,
    height: height ?? 100,
  });
  const [testDict, setDict] = useState<JsonGateDict>({});
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const modifiedDictRef = useRef<JsonGateDict>({});
  const xOffset = useRef<number>(0);
  const menuRef = useMenuContext();

  const bitLineObj: Dictionary<BitLine> = {};
  const positionObj: Dictionary<GridItem> = {};

  useEffect(() => {
    xOffset.current = (menuRef?.current?.clientWidth ?? 0) + 16;

    const _grid: GridItem[][] = [];
    for (let i = 0; i < gridSize.width; i++) {
      const row = [];
      for (let j = 0; j < gridSize.height; j++) {
        row.push(new GridItem(i, j));
      }
      _grid.push(row);
    }
    setGrid(_grid);

    const positions = Object.keys(dict ?? {});
    dict &&
      positions.forEach((_key) => {
        if (dict[_key].elementProps.hasOwnProperty("position")) {
          dict[_key].elementProps.position = xy(
            dict[_key].elementProps.position[0],
            dict[_key].elementProps.position[1],
            _grid
          );
        }
      });
    console.log(positions);

    setDict(
      dict ?? {
        testIn: {
          elementName: "node",
          elementProps: { position: xy(18, 21, _grid) },
        },
        testIn2: {
          elementName: "node",
          elementProps: { position: xy(18, 23, _grid) },
        },
        testIn3: {
          elementName: "node",
          elementProps: { position: xy(22, 26, _grid) },
        },
        test: {
          elementName: "custom",
          elementProps: {
            position: xy(20, 20, _grid),
            nodes: [
              ["left", "testIn"], //this should be type checked in dimensions, had "Left" instead of "left" before and no error
              ["left", "testIn2"], //and NaN is a number ofcourse...
              ["bottom", "testIn3"], // = if test in maps exactly to "testIn" for the internal node then gg
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              if (inputs[2]) {
                return [inputs[1]];
              }
              return [inputs[0]];
            },
            label: "MUX",
          },
        },
        testExit: {
          elementName: "node",
          elementProps: {
            position: xy(26, 22, _grid),
          },
          connect: "testright0",
        },

        a0: {
          elementName: "node",
          elementProps: {
            position: xy(38, 40, _grid),
          },
        },
        a1: {
          elementName: "node",
          elementProps: {
            position: xy(38, 42, _grid),
          },
        },
        b0: {
          elementName: "node",
          elementProps: {
            position: xy(38, 44, _grid),
          },
        },
        b1: {
          elementName: "node",
          elementProps: {
            position: xy(38, 46, _grid),
          },
        },
        c0: {
          elementName: "node",
          elementProps: {
            position: xy(38, 48, _grid),
          },
        },
        c1: {
          elementName: "node",
          elementProps: {
            position: xy(38, 50, _grid),
          },
        },
        d0: {
          elementName: "node",
          elementProps: {
            position: xy(38, 52, _grid),
          },
        },
        d1: {
          elementName: "node",
          elementProps: {
            position: xy(38, 54, _grid),
          },
        },

        Adder: {
          elementName: "custom",
          elementProps: {
            position: xy(40, 39, _grid),
            nodes: [
              ["left", "a0"],
              ["left", "a1"],
              ["left", "b0"],
              ["left", "b1"],
              ["left", "c0"],
              ["left", "c1"],
              ["left", "d0"],
              ["left", "d1"],
              ["right", "out"],
              ["right", "out"],
              ["right", "out"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]): boolean[] => {
              let carry: boolean = false;
              const out: boolean[] = Array(4).fill(false);

              for (let i = 0; i < 4; i++) {
                const total: number =
                  (inputs[i * 2] ? 1 : 0) +
                  (inputs[i * 2 + 1] ? 1 : 0) +
                  (carry ? 1 : 0);

                out[i] = total % 2 === 1;

                carry = total > 1;
              }

              return out;
            },
            label: "Adder",
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

export default Json2Grid;
