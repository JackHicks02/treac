import Json2Gates from "./components/Parser/Json2Gates"
import { xy } from "./components/Parser/Json2Grid"
import { JsonGateDict } from "./types/types"

export const multibitNot: JsonGateDict = {
  in1: {
    elementName: "node",
    elementProps: {
      position: [1, 3],
    },
  },
  not1: {
    elementName: "custom",
    elementProps: {
      position: [3, 1],
      nodes: [
        ["left", "in1"], //this should be type checked in dimensions, had "Left" instead of "left" before and no error
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out1: {
    elementName: "node",
    elementProps: {
      position: [9, 3],
    },
    connect: "not1right0",
  },

  in2: {
    elementName: "node",
    elementProps: {
      position: [1, 10],
    },
  },
  not2: {
    elementName: "custom",
    elementProps: {
      position: [3, 8],
      nodes: [
        ["left", "in2"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out2: {
    elementName: "node",
    elementProps: {
      position: [9, 10],
    },
    connect: "not2right0",
  },

  in3: {
    elementName: "node",
    elementProps: {
      position: [1, 17],
    },
  },
  not3: {
    elementName: "custom",
    elementProps: {
      position: [3, 15],
      nodes: [
        ["left", "in3"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out3: {
    elementName: "node",
    elementProps: {
      position: [9, 17],
    },
    connect: "not3right0",
  },
  in4: {
    elementName: "node",
    elementProps: {
      position: [1, 24],
    },
  },
  not4: {
    elementName: "custom",
    elementProps: {
      position: [3, 22],
      nodes: [
        ["left", "in4"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out4: {
    elementName: "node",
    elementProps: {
      position: [9, 24],
    },
    connect: "not4right0",
  },
  in5: {
    elementName: "node",
    elementProps: {
      position: [1, 31],
    },
  },
  not5: {
    elementName: "custom",
    elementProps: {
      position: [3, 29],
      nodes: [
        ["left", "in5"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out5: {
    elementName: "node",
    elementProps: {
      position: [9, 31],
    },
    connect: "not5right0",
  },

  in6: {
    elementName: "node",
    elementProps: {
      position: [1, 38],
    },
  },
  not6: {
    elementName: "custom",
    elementProps: {
      position: [3, 36],
      nodes: [
        ["left", "in6"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out6: {
    elementName: "node",
    elementProps: {
      position: [9, 38],
    },
    connect: "not6right0",
  },

  in7: {
    elementName: "node",
    elementProps: {
      position: [1, 45],
    },
  },
  not7: {
    elementName: "custom",
    elementProps: {
      position: [3, 43],
      nodes: [
        ["left", "in7"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out7: {
    elementName: "node",
    elementProps: {
      position: [9, 45],
    },
    connect: "not7right0",
  },

  in8: {
    elementName: "node",
    elementProps: {
      position: [1, 52],
    },
  },
  not8: {
    elementName: "custom",
    elementProps: {
      position: [3, 50],
      nodes: [
        ["left", "in8"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out8: {
    elementName: "node",
    elementProps: {
      position: [9, 52],
    },
    connect: "not8right0",
  },
  in9: {
    elementName: "node",
    elementProps: {
      position: [1, 59],
    },
  },
  not9: {
    elementName: "custom",
    elementProps: {
      position: [3, 57],
      nodes: [
        ["left", "in9"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out9: {
    elementName: "node",
    elementProps: {
      position: [9, 59],
    },
    connect: "not9right0",
  },

  in10: {
    elementName: "node",
    elementProps: {
      position: [1, 66],
    },
  },
  not10: {
    elementName: "custom",
    elementProps: {
      position: [3, 64],
      nodes: [
        ["left", "in10"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out10: {
    elementName: "node",
    elementProps: {
      position: [9, 66],
    },
    connect: "not10right0",
  },

  in11: {
    elementName: "node",
    elementProps: {
      position: [1, 73],
    },
  },
  not11: {
    elementName: "custom",
    elementProps: {
      position: [3, 71],
      nodes: [
        ["left", "in11"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out11: {
    elementName: "node",
    elementProps: {
      position: [9, 73],
    },
    connect: "not11right0",
  },

  in12: {
    elementName: "node",
    elementProps: {
      position: [1, 80],
    },
  },
  not12: {
    elementName: "custom",
    elementProps: {
      position: [3, 78],
      nodes: [
        ["left", "in12"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out12: {
    elementName: "node",
    elementProps: {
      position: [9, 80],
    },
    connect: "not12right0",
  },

  in13: {
    elementName: "node",
    elementProps: {
      position: [1, 87],
    },
  },
  not13: {
    elementName: "custom",
    elementProps: {
      position: [3, 85],
      nodes: [
        ["left", "in13"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out13: {
    elementName: "node",
    elementProps: {
      position: [9, 87],
    },
    connect: "not13right0",
  },

  in14: {
    elementName: "node",
    elementProps: {
      position: [1, 94],
    },
  },
  not14: {
    elementName: "custom",
    elementProps: {
      position: [3, 92],
      nodes: [
        ["left", "in14"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return [!inputs[0]];
      },
      label: "not",
    },
  },
  out14: {
    elementName: "node",
    elementProps: {
      position: [9, 94],
    },
    connect: "not14right0",
  },

  in15: {
    elementName: "node",
    elementProps: {
      position: [1, 101],
    },
  },

  a1: {
    elementName: "node",
    elementProps: {
      position: [20, 3],
    },
  },
  a2: {
    elementName: "node",
    elementProps: {
      position: [20, 5],
    },
  },
  a3: {
    elementName: "node",
    elementProps: {
      position: [20, 7],
    },
  },
  a4: {
    elementName: "node",
    elementProps: {
      position: [20, 9],
    },
  },
  a5: {
    elementName: "node",
    elementProps: {
      position: [20, 11],
    },
  },
  a6: {
    elementName: "node",
    elementProps: {
      position: [20, 13],
    },
  },
  a7: {
    elementName: "node",
    elementProps: {
      position: [20, 15],
    },
  },
  a8: {
    elementName: "node",
    elementProps: {
      position: [20, 17],
    },
  },
  a9: {
    elementName: "node",
    elementProps: {
      position: [20, 19],
    },
  },
  a10: {
    elementName: "node",
    elementProps: {
      position: [20, 21],
    },
  },
  a11: {
    elementName: "node",
    elementProps: {
      position: [20, 23],
    },
  },
  a12: {
    elementName: "node",
    elementProps: {
      position: [20, 25],
    },
  },
  a13: {
    elementName: "node",
    elementProps: {
      position: [20, 27],
    },
  },
  a14: {
    elementName: "node",
    elementProps: {
      position: [20, 29],
    },
  },
  a15: {
    elementName: "node",
    elementProps: {
      position: [20, 31],
    },
  },
  a16: {
    elementName: "node",
    elementProps: {
      position: [20, 33],
    },
  },
  bitNot16: {
    elementName: "custom",
    elementProps: {
      position: [26, 2],
      nodes: [
        ["left", "a1"],
        ["right", "out"],
        ["left", "a2"],
        ["right", "out"],
        ["left", "a3"],
        ["right", "out"],
        ["left", "a4"],
        ["right", "out"],
        ["left", "a5"],
        ["right", "out"],
        ["left", "a6"],
        ["right", "out"],
        ["left", "a7"],
        ["right", "out"],
        ["left", "a8"],
        ["right", "out"],
        ["left", "a9"],
        ["right", "out"],
        ["left", "a10"],
        ["right", "out"],
        ["left", "a11"],
        ["right", "out"],
        ["left", "a12"],
        ["right", "out"],
        ["left", "a13"],
        ["right", "out"],
        ["left", "a14"],
        ["right", "out"],
        ["left", "a15"],
        ["right", "out"],
        ["left", "a16"],
        ["right", "out"],
      ],
      func: (inputs: boolean[]) => {
        return inputs.map((input) => !input);
      },
      label: "not",
    },
  },
}
  