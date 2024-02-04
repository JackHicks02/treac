import { FC, useEffect, useState } from "react";
import { Coordinate } from "../App";
import { setVectorPoint } from "./PrototypeVector";

export interface PointProps {
  center: Coordinate;
  vectorPositionSetters: setVectorPoint[];
}

const Point2: FC<PointProps> = ({ center, vectorPositionSetters }) => {
  const [myCenter, setMyCenter] = useState<Coordinate>(center);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDraggable, setIsDraggable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsDraggable((prevState) => !prevState);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMove = (x: number, y: number) => {
    if (isDraggable) {
      setMyCenter([x, y]);
      vectorPositionSetters.forEach((setter) =>
        setter ? setter([x, y]) : null
      );
    }
  };

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (isDraggable) {
        handleMove(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [isDraggable]);

  const width: number = 10;
  return (
    <div
      style={{
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: "red",
        position: "absolute",
        left: myCenter[0],
        top: myCenter[1],
        transform: `translate(-50%, -50%)`,
        cursor: isHovered ? "pointer" : "crosshair",
        color: "blue",
        zIndex: 2,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleClick}
      // onMouseUp={handleUnClick}
      // onMouseMove={handleMove}
    >
      {/* <div>
        {mousePosition.x} {mousePosition.y}
      </div> */}
    </div>
  );
};

export default Point2;
