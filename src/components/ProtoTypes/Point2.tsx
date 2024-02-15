import { FC, useContext, useEffect, useRef, useState } from "react";
import { Coordinate } from "../../App";
import { setVectorPoint } from "./PrototypeVector";
import { MousePositionContext } from "../../utils/MousePositionContext";

export interface PointProps {
  center: Coordinate;
  vectorPositionSetters: setVectorPoint[];
  value: boolean;
  setValue: (_value: boolean) => void;
  pointValueSetter: (_value: boolean) => void;
  bindRender: (dispatch: React.Dispatch<React.SetStateAction<boolean>>) => void;
}

const Point2: FC<PointProps> = ({
  center,
  vectorPositionSetters,
  value,
  pointValueSetter,
  bindRender,
}) => {
  const [myCenter, setMyCenter] = useState<Coordinate>(center);
  const [myValue, setMyValue] = useState<boolean>(value);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDraggable, setIsDraggable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const parentDiv = useContext(MousePositionContext)?.containerRef;

  const divRef = useRef<HTMLDivElement | null>(null);

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
    if (isDraggable && parentDiv?.current) {
      const rect = parentDiv.current.getBoundingClientRect();
      const adjustedX = x - rect.left;
      const adjustedY = y - rect.top;

      setMyCenter([adjustedX, adjustedY]);
      vectorPositionSetters.forEach((setter) =>
        setter ? setter([adjustedX, adjustedY]) : null
      );
    }
  };

  useEffect(() => {
    bindRender(setMyValue);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isHovered) {
      switch (e.key) {
        case "t":
          pointValueSetter(true);
          break;
        case "f":
          pointValueSetter(false);
          break;
        default:
          break;
      }
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
      tabIndex={1}
      ref={divRef}
      style={{
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: myValue ? "blue" : "white",
        position: "absolute",
        left: myCenter[0],
        top: myCenter[1],
        transform: `translate(-50%, -50%)`,
        cursor: isHovered ? "pointer" : "crosshair",
        color: myValue ? "cyan" : "white",
        zIndex: 2,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleClick}
      onKeyDown={handleKeyPress}
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
