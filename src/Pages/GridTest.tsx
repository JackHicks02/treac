class GridItem {
  public static readonly size: number = 12;

  x: number;
  y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const GridContainer = () => {};

export const GridPage = () => {
  return (
    <div style={{ width: 2000, height: "1px", backgroundColor: "red" }}></div>
  );
};
