import { FC, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BitLine } from "../Squidward/Gates";
import { Coordinate, useMenuContext } from "../../app";
import {
  NAND,
  SquareVectorFromObj,
  BitNode,
  BinaryGate,
  UnaryGate,
} from "./ExtensibleGatesGrid";
import {
  Dictionary,
  JsonGateDict,
  ElementArray,
  unFunc,
} from "../../types/types";

export class GridItem {
  public static readonly gap: number = 24;
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
                JSON[entry.connect].elementProps.position +
                "-" +
                entry.elementProps.position
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
      // case "binarygate":
      //   bitLineObj[_key] = new BitLine(
      //     entry.func!(
      //       findConnection(entry.elementProps.A, _key)!.getBit(),
      //       findConnection(entry.elementProps.B, _key)!.getBit()
      //     )
      //   );

      //   ElementArray.unshift(
      //     <BinaryGate
      //       func={entry.func!}
      //       key={_key}
      //       keyID={_key}
      //       CLine={bitLineObj[_key]}
      //       ALine={findConnection(entry.elementProps.A, _key)!}
      //       BLine={findConnection(entry.elementProps.B, _key)!}
      //       positionObj={positionObj}
      //       position={entry.elementProps.position}
      //       label={entry.elementProps.label ?? "ANON"}
      //     />
      //   );

      //   ElementArray.push(
      //     <SquareVectorFromObj
      //       key={_key + "A"}
      //       positionObj={positionObj}
      //       originKey={entry.elementProps.A}
      //       destinationKey={_key + "A"}
      //       bitLine={findConnection(entry.elementProps.A, _key)!}
      //     />
      //   );
      //   ElementArray.push(
      //     <SquareVectorFromObj
      //       key={_key + "B"}
      //       positionObj={positionObj}
      //       originKey={entry.elementProps.B}
      //       destinationKey={_key + "B"}
      //       bitLine={findConnection(entry.elementProps.B, _key)!}
      //     />
      //   );
      //   break;
      // case "unarygate":
      //   const func = entry.func as unFunc;

      //   bitLineObj[_key] = new BitLine(
      //     func(findConnection(entry.elementProps.A, _key)!.getBit())
      //   );

      //   ElementArray.unshift(
      //     <UnaryGate
      //       func={entry.func as unFunc}
      //       key={_key}
      //       keyID={_key}
      //       CLine={bitLineObj[_key]}
      //       ALine={findConnection(entry.elementProps.A, _key)!}
      //       positionObj={positionObj}
      //       position={entry.elementProps.position}
      //       label={entry.elementProps.label ?? "ANON"}
      //     />
      //   );

      //   ElementArray.push(
      //     <SquareVectorFromObj
      //       key={_key + "A"}
      //       positionObj={positionObj}
      //       originKey={entry.elementProps.A}
      //       destinationKey={_key + "A"}
      //       bitLine={findConnection(entry.elementProps.A, _key)!}
      //     />
      //   );

      //   break;

      default:
        throw new Error(`No component by the name of ${entry.elementName}`);
    }
  });

  return ElementArray;
};

interface Json2GatesProps {
  dict?: JsonGateDict;
}

const Json2Grid: FC<Json2GatesProps> = ({ dict }) => {
  const [grid, setGrid] = useState<GridItem[][]>([]);
  const [gridSize, _setGridSize] = useState({ width: 100, height: 50 });
  const [testDict, setTestDict] = useState<JsonGateDict>({});

  const gridRef = useRef<null | SVGSVGElement>(null);
  const xOffset = useRef<number>(0);
  const menuRef = useMenuContext();

  const bitLineObj: Dictionary<BitLine> = {};
  const positionObj: Dictionary<GridItem> = {};

  const xy = (x: number, y: number, _grid: GridItem[][]): GridItem =>
    _grid[x][y];

  useLayoutEffect(() => {
    xOffset.current = (menuRef?.current?.clientWidth ?? 0) + 16;

    const _grid = [];
    for (let i = 0; i < 100; i++) {
      const row = [];
      for (let j = 0; j < 100; j++) {
        row.push(new GridItem(i, j));
      }
      _grid.push(row);
    }
    setGrid(_grid);

    setTestDict(
      dict ?? {
        //Connect refers to the "CLine", or output line, which is defined
        a: {
          elementName: "node",
          elementProps: { position: xy(20, 20, _grid), bs: 123, label: "In" }, // You can stick anything in here and typescript doesn't care unfortunately so this won't catch typos
        }, // Won't even warn the console
        b: {
          elementName: "node",
          elementProps: {
            position: xy(20, 22, _grid),
          },
        },
        bob: {
          elementName: "nand",
          elementProps: {
            position: xy(30, 21, _grid),
            A: "a",
            B: "b",
          },
        },
        out: {
          elementName: "node",
          elementProps: {
            position: xy(32, 22, _grid),
            label: "Out",
          },
          connect: "bob",
        },
        testNode: {
          elementName: "node",
          elementProps: {
            position: xy(3, 3, _grid),
            backgroundColor: "red",
            label: "3,3",
          },
        },
        testNode2: {
          elementName: "node",
          elementProps: {
            position: xy(6, 6, _grid),
            backgroundColor: "red",
            label: "6,6",
          },
          connect: "testNode",
        },
      }
    );
  }, []);

  const svgWidth = gridSize.width * GridItem.gap;
  const svgHeight = gridSize.height * GridItem.gap;

  const circuit = useMemo(
    () => Json2Elements(testDict, bitLineObj, positionObj, grid),
    [testDict]
  );

  return (
    <>
      <p style={{ position: "absolute" }}>json 2 grid test</p>
      {circuit}
      <svg
        ref={gridRef}
        style={{
          position: "absolute",
        }}
        width={svgWidth}
        height={svgHeight}
      >
        {grid.map((row) =>
          row.map((gridItem) => (
            <circle
              key={gridItem.getCoords().toString()}
              cx={gridItem.getCoords()[0]}
              cy={gridItem.getCoords()[1]}
              r="2"
              stroke="rgba(255,255,255,0.125)"
              strokeWidth="1"
              fill="rgba(255,255,255,0.125)"
              style={{ zIndex: 23 }}
            />
          ))
        )}
      </svg>
    </>
  );
};

export default Json2Grid;
