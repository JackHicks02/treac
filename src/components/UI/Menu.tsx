import { useJem } from "../../utils/JemStore";
import { tabsDict } from "../../utils/TabsDict";
import MenuListItem from "./MenuListItem";
import SpinMoji from "./SpinMoji";

const Menu = () => {
  return (
    <div style={{ borderRight: "4px double white", padding: "8px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <strong>Treac</strong>
        <div
          style={{
            padding: "2px",
            width: "256px",
            border: "1px dashed white",
          }}
        >
          "<strong>Remember</strong>: React uses one-way data flow, passing data
          down the component hierarchy from parent to child component"
        </div>
        <SpinMoji />
        <ul>
          {Object.keys(tabsDict).map((tabKey) => (
            <MenuListItem text={tabKey} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
