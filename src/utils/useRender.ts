import { useState } from "react";

export const useRender = () => {
  const [render, force] = useState<number>(0)
  const _render = () => force(prev=>(prev + 1) % 64) //Equal storage to bool? Allows up to 64 calls per frame...
  return _render;

}