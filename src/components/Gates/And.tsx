import { FC } from "react";
import { Coordinate } from "../../App";

interface ANDProps {
  centre: Coordinate;
}

const AND: FC<ANDProps> = ({ centre }) => {
  const width = 40;
  const height = 40;
  return (
    <div
      style={{
        position: "absolute",
        width: "50px",
        height: "50px",
        border: "1px dashed white",
        left: centre[0],
        top: centre[1],
      }}
    >
      <div
        style={{
          position: "absolute",

          width: "40px",
          height: "40px",
          border: "1px solid white",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "40px",
        }}
      />
      <div
        style={{
          position: "absolute",
          backgroundColor: "black",
          width: "40px",
          height: "30px",
          left: "50%",
          top: "20px",
          transform: "translate(-50%, 0)",
          borderRight: "1px solid white",
          borderLeft: "1px solid white",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "40px",
          height: "1px",
          left: "50%",
          top: "50px",
          transform: "translate(-50%, 0)",
          border: "1px solid white",
        }}
      />
    </div>
  );
};

export default AND;
