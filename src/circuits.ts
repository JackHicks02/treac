import Json2Gates from "./components/Parser/Json2Gates"
import { xy } from "./components/Parser/Json2Grid"
import { JsonGateDict } from "./types/types"

export const multibitNot: JsonGateDict = {
  a : {
    elementName: "node",
    elementProps: {
      position: [1,1]
    }
  }
}