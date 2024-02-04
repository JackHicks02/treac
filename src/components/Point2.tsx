import { FC, useEffect, useState } from "react";
import { Coordinate } from "../App";
import { setVectorPoint } from "./PrototypeVector";

export interface PointProps {
  center: Coordinate;
  vectorPositionSetters: setVectorPoint[];
}

const Point2: FC<PointProps> = ({ center, vectorPositionSetters }) => {
  const [myCenter, setMyCenter] = useState<Coordinate>(center);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDraggable, setIsDraggable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsDraggable(true);
  };

  const handleUnClick = () => {
    setIsDraggable(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMove = () => {
    if (isDraggable) {
      setMyCenter([mousePosition.x, mousePosition.y]);
      console.log(vectorPositionSetters);
      vectorPositionSetters.forEach((setter) =>
        setter ? setter([mousePosition.x, mousePosition.y]) : null
      );
    }
  };

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (isHovered) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [isHovered]);

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
      onMouseUp={handleUnClick}
      onMouseMove={handleMove}
    >
      {/* <div>
        {mousePosition.x} {mousePosition.y}
      </div> */}
    </div>
  );
};

export default Point2;
