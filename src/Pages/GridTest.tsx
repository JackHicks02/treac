import {
  CSSProperties,
  FC,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Coordinate, useMenuContext } from "../App";
import { useStyle } from "../utils/useStyle";
import { useJem } from "../utils/JemStore";

type GridSpace = GridItem[]; //what gridItems (points?) belong to a component

interface GridNodeProps {
  grid: GridItem[][];
  gridSpace: GridItem;
  xOffset: number;
}

const GridNode: FC<GridNodeProps> = ({ gridSpace, grid, xOffset }) => {
  const [localGridSpace, setLocalGridSpace] =
    useState<typeof gridSpace>(gridSpace);
  const [value, setValue] = useState<boolean>(false);
  const style = useStyle()[0];

  const handleClick = useCallback(() => {
    setValue((prev) => !prev);
  }, [grid, xOffset]);

  const handleDragEnd = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const x = event.clientX - xOffset;
      const y = event.clientY;
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

const GridContainer = () => {};

export const GridPage = () => {
  const [grid, setGrid] = useState<GridItem[][]>([]);
  const [gridSize, setGridSize] = useState({ width: 100, height: 50 });
  const style = useStyle()[0];

  const gridRef = useRef<null | SVGSVGElement>(null);
  const xOffset = useRef<number>(0);
  const menuRef = useMenuContext();

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
              r="2" // Radius of the circle
              stroke="blue"
              strokeWidth="1" // Adjust stroke-width to your liking
              fill="blue"
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
          />
          <GridNode
            gridSpace={grid[99][49]}
            grid={grid}
            xOffset={xOffset.current}
          />
        </>
      )}
    </>
  );
};
