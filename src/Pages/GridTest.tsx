import {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Coordinate } from "../App";
import { useStyle } from "../utils/useStyle";

type GridSpace = GridItem[]; //what gridItems (points?) belong to a component

interface GridNodeProps {
  grid: GridItem[][];
  gridSpace: GridItem;
}

const GridNode: FC<GridNodeProps> = ({ gridSpace, grid }) => {
  const [localGridSpace, setLocalGridSpace] =
    useState<typeof gridSpace>(gridSpace);

  console.log(localGridSpace);
  const [value, setValue] = useState<boolean>(false);
  const style = useStyle()[0];

  const handleClick = useCallback(() => {
    setValue((prev) => !prev);
    setLocalGridSpace((prev) => grid[prev.x + 1][prev.y + 1]);
  }, []);

  return (
    <div
      onClick={handleClick}
      draggable={true}
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

  public constructor(x: number, y: number) {
    this.owner = null;
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
  const [gridSize, setGridSize] = useState({ width: 100, height: 50 }); // Adjust based on your actual grid size
  const style = useStyle()[0]; // Assuming this is where your styles are defined

  useEffect(() => {
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
        style={{
          position: "absolute",
        }}
        width={svgWidth}
        height={svgHeight}
      >
        {grid.map((row) =>
          row.map((gridItem) => (
            <circle
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
          <GridNode gridSpace={grid[3][2]} grid={grid} />
          <GridNode gridSpace={grid[99][49]} grid={grid} />
        </>
      )}
    </>
  );
};
