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
          : findConnection(entry.connect, _key)!;

        if (!entry.connect) {
          bitLineObj[_key] = CLine;
        } else {
          ElementArray.push(
            <SquareVectorFromObj
              key={
                entry.connect
                  ? JSON[entry.connect].elementProps.position +
                    "-" +
                    entry.elementProps.position
                  : _key
              }
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
        const nodes = entry.elementProps.nodes as [string, string][];
        const label = entry.elementProps.label as string;
        const func = entry.elementProps.func as nFunc;
        const position = entry.elementProps.position as GridItem;

        const ins: [string, string][] = [];
        const outs: [string, string][] = [];

        nodes.forEach((node) =>
          node[1] === "out" ? outs.push(node) : ins.push(node)
        );
        outs.forEach((node) => (bitLineObj[node[0]] = new BitLine()));

        console.log(ins);
        console.log(outs);

        ElementArray.unshift(
          <NGate
            label={label}
            keyID={_key}
            BitLines={{}}
            positionObj={positionObj}
            position={position}
            grid={[]}
            func={func}
          />
        );

        ins.forEach((inLine, index) => {
          ElementArray.unshift(
            <SquareVectorFromObj
              key={_key + " in " + index}
              positionObj={positionObj}
              originKey={ins[index][1]}
              destinationKey={_key + "B"}
              bitLine={findConnection(ins[index][1], _key)!}
            />
          );
        });

        bitLineObj[_key] = new BitLine();

        // ElementArray.unshift(<NGate key={_key} label={label} />);

        break;

      default:
        throw new Error(`No component by the name of ${entry.elementName}`);
    }
  });
  console.log(positionObj);
  return ElementArray;
};

interface Json2GatesProps {
  dict?: JsonGateDict;
}

const Json2Grid: FC<Json2GatesProps> = ({ dict }) => {
  const [grid, setGrid] = useState<GridItem[][]>([]);
  const [gridSize, _setGridSize] = useState({ width: 200, height: 100 });
  const [testDict, setTestDict] = useState<JsonGateDict>({});
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const gridRef = useRef<null | SVGSVGElement>(null);
  const xOffset = useRef<number>(0);
  const menuRef = useMenuContext();

  const bitLineObj: Dictionary<BitLine> = {};
  const positionObj: Dictionary<GridItem> = {};

  const xy = (x: number, y: number, _grid: GridItem[][]): GridItem =>
    _grid[x][y];

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
        testIn: {
          elementName: "node",
          elementProps: { position: xy(18, 20, _grid) },
        },
        testIn2: {
          elementName: "node",
          elementProps: { position: xy(18, 22, _grid) },
        },
        testIn3: {
          elementName: "node",
          elementProps: { position: xy(18, 24, _grid) },
        },
        test: {
          elementName: "custom",
          elementProps: {
            position: xy(20, 20, _grid),
            nodes: [
              ["Left", "testIn"],
              ["Left", "testIn2"],
              ["Bottom", "testIn3"],
              ["right", "out"],
            ],
            func: (inputs: boolean[]) => {
              if (inputs[0] && inputs[2]) {
                return inputs[0];
              }
              return [inputs[1]];
            },
          },
        },
        testOut: {
          elementName: "node",
          elementProps: {
            position: xy(26, 22, _grid),
          },
        },

        a: {
          elementName: "node",
          elementProps: { position: xy(1, 3, _grid), bs: 12311 },
        },
        not: {
          elementName: "nand",
          elementProps: {
            position: xy(4, 1, _grid),
            A: "a",
            B: "a",
          },
        },
        out: {
          elementName: "node",
          elementProps: {
            position: xy(10, 3, _grid),
            label: "Not",
          },
          connect: "not",
        },
        doubleout: {
          elementName: "node",
          elementProps: {
            position: xy(12, 3, _grid),
          },
          connect: "out",
        },

        andA: {
          elementName: "node",
          elementProps: { position: xy(1, 9, _grid) },
        },
        andB: {
          elementName: "node",
          elementProps: { position: xy(1, 11, _grid) },
        },
        andNand: {
          elementName: "nand",
          elementProps: { position: xy(4, 8, _grid), A: "andA", B: "andB" },
        },
        andNot: {
          elementName: "nand",
          elementProps: {
            position: xy(12, 8, _grid),
            A: "andNand",
            B: "andNand",
          },
        },
        andOut: {
          elementName: "node",
          elementProps: {
            position: xy(20, 10, _grid),
            label: "And",
          },
          connect: "andNot",
        },
      }
    );

    setLoading(false);
  }, []);

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
