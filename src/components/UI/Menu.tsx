import { forwardRef } from "react";
import { Nand2Infinity, tabsDict } from "../../utils/TabsDict";
import MenuListItem from "./MenuListItem";
import SpinMoji from "./SpinMoji";

interface MenuProps {}

const Menu = forwardRef<HTMLDivElement, MenuProps>((_props, ref) => {
  return (
    <div style={{ borderRight: "4px double white", padding: "8px" }} ref={ref}>
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
        {/* <SpinMoji /> */}
        <div>
          <div style={{ textAlign: "center" }}>--Experiments--</div>
          <ul>
            {Object.keys(tabsDict).map((tabKey) => (
              <MenuListItem text={tabKey} key={tabKey} />
            ))}
          </ul>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            --
            <span>NAND 2</span>
            <span style={{ fontSize: 28 }}>
              <strong>∞</strong>
            </span>
            --
          </div>
          <ul>
            {Object.keys(Nand2Infinity).map((tabKey) => (
              <MenuListItem text={tabKey} key={tabKey} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default Menu;
