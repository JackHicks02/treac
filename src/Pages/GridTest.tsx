import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Coordinate, useMenuContext } from "../app";
import { useStyle } from "../utils/useStyle";
import { BitLine } from "../components/Squidward/Gates";
import { Dictionary } from "../types/types";
import { gateStyle } from "../utils/StyleContext";
import { useTwoLineMount } from "../utils/utils";

type Grid = GridItem[][]; //what gridItems (points?) belong to a component

interface GridComponent {
  grid: Grid;
  gridSpace: Grid;
  xOffset: number;
  yOffset: number;
}

interface GridNodeProps extends Omit<GridComponent, "gridSpace"> {
  gridSpace: GridItem;
}

interface GridLineProps extends Omit<GridComponent, "gridSpace"> {
  gridSpace: GridItem[];
}

const GridShape: FC<GridLineProps> = ({
  grid,
  gridSpace,
  xOffset,
  yOffset,
}) => {
  const style = useStyle()[0];

  if (gridSpace.length < 3) {
    console.error(
      "GridPolygon expects at least three grid points to form a polygon"
    );
    return null;
  }

  const sides = [];
  for (let i = 0; i < gridSpace.length; i++) {
    const side = [gridSpace[i], gridSpace[(i + 1) % gridSpace.length]]; // Loop back to the first point after the last
    sides.push(side);
  }

  return (
    <svg
      style={{
        position: "absolute",
        zIndex: 2,
        left: -xOffset,
        top: -yOffset,
        overflow: "visible",
      }}
    >
      {sides.map((side, index) => (
        <GridLine
          key={`side-${index}`}
          gridSpace={side}
          grid={grid}
          xOffset={xOffset}
          yOffset={yOffset}
        />
      ))}
    </svg>
  );
};

const GridLine: FC<GridLineProps> = ({ grid, gridSpace, xOffset, yOffset }) => {
  const style = useStyle()[0];

  const lines = gridSpace.map((gridItem, index) => {
    if (index < gridSpace.length - 1) {
      const nextGridItem = gridSpace[index + 1];
      const [x1, y1] = gridItem.getCoords();
      const [x2, y2] = nextGridItem.getCoords();
      return (
        <line
          key={`line-${index}`}
          x1={x1 + xOffset}
          y1={y1 + yOffset}
          x2={x2 + xOffset}
          y2={y2 + yOffset}
          stroke={style.defaultOff}
          strokeWidth={style.vectorThickness || "2"}
        />
      );
    }
    return null;
  });
  return (
    <svg
      style={{
        position: "absolute",
        zIndex: 2,
        left: -xOffset,
        top: -yOffset,
        overflow: "visible",
      }}
    >
      {lines}
    </svg>
  );
};

// export const NAND: FC<GridLineProps> = ({
//   grid,
//   gridSpace,

// }): JSX.Element => {
//   const style = useStyle()[0];

//   const [a, b] = [ALine.getBit(), BLine.getBit()];
//   const c = !(a && b);

//   useTwoLineMount(ALine, BLine, CLine, c);

//   useMemo(() => {
//     positionObj[`${keyID}A`] = [
//       position[0] - style.gateWidth / 2,
//       position[1] + gateStyle.gateWidth / 3 - gateStyle.gateWidth / 2,
//     ];
//     positionObj[keyID + "B"] = [
//       position[0] - style.gateWidth / 2,
//       position[1] + (2 * gateStyle.gateWidth) / 3 - gateStyle.gateWidth / 2,
//     ];
//     positionObj[keyID] = [position[0] + gateStyle.gateWidth / 2, position[1]];
//   }, []);

//   if (!position) {
//     return <></>;
//   }

//   return (
//       <GridNode gridSpace={undefined} grid={gri} xOffset={0} yOffset={0}
//       />

//   );
// };

const GridNode: FC<GridNodeProps> = ({ gridSpace, grid, xOffset, yOffset }) => {
  const [localGridSpace, setLocalGridSpace] =
    useState<typeof gridSpace>(gridSpace);
  const [value, setValue] = useState<boolean>(false);
  const style = useStyle()[0];

  const handleClick = useCallback(() => {
    setValue((prev) => !prev);
  }, [grid, xOffset]);

  const handleDrag = (e: any) => {
    console.log(typeof e);
  };

  const handleDragEnd = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const x = event.clientX - xOffset;
      const y = event.clientY - yOffset;
      let nearestX = Math.round(x / GridItem.gap);
      let nearestY = Math.round(y / GridItem.gap);
      nearestX = Math.max(0, Math.min(nearestX, grid.length - 1));
      nearestY = Math.max(0, Math.min(nearestY, grid[0].length - 1));
      setLocalGridSpace(grid[nearestX][nearestY]);
    },
    [grid, xOffset]
  );

  return (
    <div
      draggable={true}
      onClick={handleClick}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      style={{
        position: "absolute",
        left: localGridSpace.getCoords()[0],
        top: localGridSpace.getCoords()[1],
        backgroundColor: value ? style.defaultOn : style.defaultOff,
        width: style.nodeWidth,
        height: style.nodeWidth,
        borderRadius: style.nodeWidth,
        transform: `translate(-50%, -50%)`,
        zIndex: 0,
        cursor: "pointer",
      }}
    />
  );
};

class GridItem {
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
          transform: "translate(-50%, -50%)", //think about this carefully
        }}
      />
    );
  };
}

type Direction = "right" | "left" | "up" | "down";
// const Snake: FC<GridLineProps> = ({ grid, gridSpace, xOffset, yOffset }) => {
//   const [currentCoords, setCurrentCoords] = useState<GridItem[]>(gridSpace);
//   const direction = useRef<Direction>("right");

//   console.log(gridSpace);

//   const handleMove = useCallback(
//     (direction: Direction) => {
//       switch (direction) {
//         case "right":
//           console.log([grid[currentCoords[1].x + 1][currentCoords[1].y]]);
//           setCurrentCoords((prev) => [grid[prev[1].x + 1][prev[1].y]]);
//           break;
//         default:
//           return;
//       }
//     },
//     [grid, currentCoords]
//   );

//   const handleKeyPress = (e: KeyboardEvent): void => {
//     switch (e.key) {
//       case "d":
//         direction.current = "right";
//         break;
//       case "a":
//         direction.current = "left";
//         break;
//       case "w":
//         direction.current = "up";
//         break;
//       case "s":
//         direction.current = "down";
//         break;
//       default:
//         return;
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyPress);
//     const interval = setInterval(() => {
//       handleMove(direction.current);
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//       window.removeEventListener("keydown", handleKeyPress);
//     };
//   }, []);

//   return (
//     <GridLine
//       grid={grid}
//       gridSpace={currentCoords}
//       xOffset={xOffset}
//       yOffset={yOffset}
//     />
//   );
// };

const GridContainer = () => {};

export const GridPage = () => {
  const [grid, setGrid] = useState<GridItem[][]>([]);
  const [gridSize, setGridSize] = useState({ width: 100, height: 50 });
  const style = useStyle()[0];

  const gridRef = useRef<null | SVGSVGElement>(null);
  const xOffset = useRef<number>(0);
  const menuRef = useMenuContext();

  const yOffset = 8;
  const gridCallback = () => {
    // console.log(xOffset.current);
  };

  // useEffect(() => {
  //   window.addEventListener("mousemove", gridCallback);

  //   return () => window.removeEventListener("mouseMove", gridCallback);
  // }, []);

  useLayoutEffect(() => {
    console.log("grid ref: ", gridRef.current);

    gridRef.current?.addEventListener("mousemove", gridCallback);

    xOffset.current = (menuRef?.current?.clientWidth ?? 0) + 16;

    console.log(xOffset.current);
    const _grid = [];
    for (let i = 0; i < 100; i++) {
      const row = [];
      for (let j = 0; j < 50; j++) {
        row.push(new GridItem(i, j));
      }
      _grid.push(row);
    }
    setGrid(_grid);
  }, []);

  const svgWidth = gridSize.width * GridItem.gap;
  const svgHeight = gridSize.height * GridItem.gap;

  return (
    <>
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

      {grid.length > 3 && grid[3].length > 2 && (
        <>
          <GridNode
            gridSpace={grid[3][2]}
            grid={grid}
            xOffset={xOffset.current}
            yOffset={yOffset}
          />
          <GridNode
            gridSpace={grid[99][49]}
            grid={grid}
            xOffset={xOffset.current}
            yOffset={yOffset}
          />
          <GridLine
            grid={grid}
            gridSpace={[grid[1][1], grid[1][4], grid[3][4], grid[3][20]]}
            xOffset={xOffset.current}
            yOffset={yOffset}
          />
          <GridShape
            grid={grid}
            gridSpace={[grid[10][10], grid[14][10], grid[20][20], grid[10][20]]}
            xOffset={xOffset.current}
            yOffset={yOffset}
          />
          {/* <Snake
            grid={grid}
            gridSpace={[grid[0][0], grid[1][0]]}
            xOffset={xOffset.current}
            yOffset={yOffset}
          /> */}
        </>
      )}
    </>
  );
};
