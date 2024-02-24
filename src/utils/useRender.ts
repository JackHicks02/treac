import { useState } from "react";

/**
 * 
 * @returns Function to be called when you wish to re-render a React component
 */


export const useRender = () => {
  const force = useState<number>(0)[1]
  const _render = () => force(prev=>prev + 1)
  return _render;
}