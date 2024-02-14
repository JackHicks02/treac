import { useEffect, useState } from "react";

const SpinMoji = () => {
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    setInterval(() => {
      setRotation((prevRotation) => {
        if ((prevRotation + 6) % 360 === 0) {
          return 0;
        }
        return prevRotation + 6;
      });
    }, 2000 / 60);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "60px",
          height: "180px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            position: "absolute",
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "50% 50%",
          }}
        >
          🤔 🤔 🤔
        </div>
      </div>
    </div>
  );
};

export default SpinMoji;
