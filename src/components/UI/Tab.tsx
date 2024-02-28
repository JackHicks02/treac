import { useContext } from "react";
import { useJemListener } from "../../utils/JemStore";
import { MousePositionContext } from "../../utils/MousePositionContext";
import { Nand2Infinity, tabsDict } from "../../utils/TabsDict";

const Tab = () => {
  const tabJem = useJemListener<string>("tab");
  const testJem = useJemListener("hello");

  const mouseContext = useContext(MousePositionContext)?.containerRef;

  return (
    <div
      className="custom-scrollbar"
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "black",
        overflow: "auto",
      }}
      // ref={mouseContext}
    >
      {tabsDict[tabJem.getValue()] ?? Nand2Infinity[tabJem.getValue()]}
    </div>
  );
};

export default Tab;
