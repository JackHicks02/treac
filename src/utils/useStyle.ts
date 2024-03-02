import { useContext } from "react"
import { GateStyleConext, gateStyle } from "./StyleContext"

export const useStyle = () => {
  return useContext(GateStyleConext) ?? gateStyle
  //fall back if outside context, this should always work
}