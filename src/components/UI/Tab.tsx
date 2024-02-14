import { useJemListener } from "../../utils/JemStore";
import { tabsDict } from "../../utils/TabsDict";

const Tab = () => {
  const tabJem = useJemListener<string>("tab");

  return <div style={{ height: "100%" }}>{tabsDict[tabJem.getValue()]}</div>;
};

export default Tab;
