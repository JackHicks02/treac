import Json2Gates from "./components/Parser/Json2Gates"
import { xy } from "./components/Parser/Json2Grid"
import { JsonGateDict } from "./types/types"

export const multibitNot: JsonGateDict = {
  testIn: {
    elementName: "node",
    elementProps: { position: [2,0] },
  },
  testIn2: {
    elementName: "node",
    elementProps: { position: [8,0] },
    connect: "testIn"
  },
  testIn3: {
    elementName: "node",
    elementProps: { position: [15,0] },
    connect: "testIn2"
  },
  
}