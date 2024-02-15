import { useState } from "react";

export const useRender = () => {
  const render = useState<boolean>(false)[1]
  const _render = () => render(prev=>!prev)
  return _render;
}