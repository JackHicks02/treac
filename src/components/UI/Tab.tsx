import { useContext } from "react";
import { useJemListener } from "../../utils/JemStore";
import { MousePositionContext } from "../../utils/MousePositionContext";
import { tabsDict } from "../../utils/TabsDict";

const Tab = () => {
  const tabJem = useJemListener<string>("tab");

  const mouseContext = useContext(MousePositionContext)?.containerRef;

  return (
    <div style={{ height: "100%" }} ref={mouseContext}>
      {tabsDict[tabJem.getValue()]}
    </div>
  );
};

export default Tab;
