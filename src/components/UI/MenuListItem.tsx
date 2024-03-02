import { useState } from "react";
import { updateJem, useJem, useJemListener } from "../../utils/JemStore";

const MenuListItem = ({ text }: { text: string }) => {
  const tabJem = useJemListener("tab");

  const [hovered, setHovered] = useState<boolean>(false);
  const clicked = tabJem.getValue() == text;

  const handleClick = () => {
    updateJem(tabJem, text);
  };

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        cursor: hovered ? "pointer" : "default",
        color: !clicked ? "white" : "grey",
      }}
    >
      {text}
    </li>
  );
};

export default MenuListItem;
