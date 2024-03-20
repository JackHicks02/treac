import _ from "lodash";
import { Dictionary, GateEntry, JsonGateDict } from "./types/types";
import { xor } from "./utils/utils";

const stdLib = {
  nodeLine: ({
    x,
    y,
    amount,
    vertical,
    connects,
    awaits,
    spacing = 2,
    diagonal = false,
  }: Dictionary<any>) => {
    const nodes: Dictionary<GateEntry> = {};

    let diagFactor = 1;

    if (diagonal === "-") {
      diagFactor = -1;
    }

    for (let i = 0; i < amount; i++) {
      nodes[i] = {
        elementName: "node",
        elementProps: {
          position: [
            x + (!vertical || diagonal ? spacing * i : 0),
            y + (vertical || diagonal ? spacing * diagFactor * i : 0),
          ],
        },
      };
    }
    connects &&
      (connects as string[]).forEach((connectString, index) => {
        nodes[index].connect = connectString;
        if (awaits) {
          nodes[index].elementProps["await"] = connectString;
        }
      });

    return nodes;
  },
  not: ({ position, nodes }: Dictionary<any>) => {
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            const outs: boolean[] = [];
            inputs.forEach((input) => outs.push(!input));
            return outs;
          },
          label: "NOT",
        },
      },
    ];
  },
  xor: ({ position, nodes }: Dictionary<any>) => {
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            return [(inputs[0] && !inputs[1]) || (!inputs[0] && inputs[1])];
          },
          label: "XOR",
        },
      },
    ];
  },
  and: ({ position, nodes }: Dictionary<any>) => {
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            return [inputs.every((input) => input)];
          },
          label: "AND",
        },
      },
    ];
  },
  multiBitAnd: ({ position, nodes, bit }: Dictionary<any>) => {
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            const outs: boolean[] = [];
            for (let i = 0; i < bit * 2; i += 2) {
              outs.push(inputs[i] && inputs[i + 1]);
            }
            return outs;
          },
          label: "MULTI-BIT AND",
        },
      },
    ];
  },
  multiBitOr: ({ position, nodes, bit }: Dictionary<any>) => {
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            const outs: boolean[] = [];
            for (let i = 0; i < bit * 2; i += 2) {
              outs.push(inputs[i] || inputs[i + 1]);
            }
            return outs;
          },
          label: "MULTI-BIT OR",
        },
      },
    ];
  },
  multiBitMux: ({ position, nodes, bit }: Dictionary<any>) => {
    //i[0..] - A
    //i[bit...] - B
    //i[bit+1] - S
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            const outs: boolean[] = [];
            const lastInput = inputs[inputs.length - 1];
            if (!lastInput) {
              outs.push(...inputs.slice(0, bit));
            } else {
              outs.push(...inputs.slice(bit, inputs.length - 1));
            }
            return outs;
          },
          label: "MULTI-BIT MUX",
        },
      },
    ];
  },
  or: ({ position, nodes }: Dictionary<any>) => {
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            return [inputs.some((input) => input)];
          },
          label: "OR",
        },
      },
    ];
  },
  halfAdder: ({ position, nodes }: Dictionary<any>) => {
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            const outs = [false, false];
            if (xor(inputs[0], inputs[1])) {
              outs[0] = true;
            }
            if (inputs[0] && inputs[1]) {
              outs[1] = true;
            }
            return outs;
          },
          label: "H-ADD",
        },
      },
    ];
  },
  fullAdder: ({ position, nodes }: Dictionary<any>) => {
    return [
      {
        elementName: "custom",
        elementProps: {
          nodes: nodes,
          position: position,
          func: (inputs: boolean[]): boolean[] => {
            const outs = [false, false];
            if (xor(xor(inputs[0], inputs[1]), inputs[2])) {
              outs[0] = true;
            }
            if (
              (inputs[0] && inputs[1]) ||
              (inputs[2] && xor(inputs[0], inputs[1]))
            ) {
              outs[1] = true;
            }
            return outs;
          },
          label: "F-ADD",
        },
      },
    ];
  },
};

export const multiBitAnd: JsonGateDict = {
  declare: {
    ...stdLib,
  },
  notIN: JSON.stringify({
    name: "nodeLine",
    x: 2,
    y: 2,
    amount: 16,
    vertical: true,
  }),
  not: JSON.stringify({
    name: "not",
    position: [4, 1],
    nodes: [
      ["left", "notIN0"],
      ["left", "notIN1"],
      ["left", "notIN2"],
      ["left", "notIN3"],
      ["left", "notIN4"],
      ["left", "notIN5"],
      ["left", "notIN6"],
      ["left", "notIN7"],
      ["left", "notIN8"],
      ["left", "notIN9"],
      ["left", "notIN10"],
      ["left", "notIN11"],
      ["left", "notIN12"],
      ["left", "notIN13"],
      ["left", "notIN14"],
      ["left", "notIN15"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  notOuts: JSON.stringify({
    name: "nodeLine",
    x: 10,
    y: 2,
    amount: 16,
    vertical: true,
    connects: [
      "not0out0",
      "not0out1",
      "not0out2",
      "not0out3",
      "not0out4",
      "not0out5",
      "not0out6",
      "not0out7",
      "not0out8",
      "not0out9",
      "not0out10",
      "not0out11",
      "not0out12",
      "not0out13",
      "not0out14",
      "not0out15",
    ],
    awaits: true,
  }),

  andIns: JSON.stringify({
    name: "nodeLine",
    x: 2,
    y: 40,
    amount: 16,
  }),
  andInsB: JSON.stringify({
    name: "nodeLine",
    x: 2,
    y: 76,
    amount: 16,
  }),
  and: JSON.stringify({
    name: "multiBitAnd",
    position: [1, 42],
    bit: 16,
    nodes: [
      ["top", "andIns0"],
      ["bottom", "andInsB0"],
      ["top", "andIns1"],
      ["bottom", "andInsB1"],
      ["top", "andIns2"],
      ["bottom", "andInsB2"],
      ["top", "andIns3"],
      ["bottom", "andInsB3"],
      ["top", "andIns4"],
      ["bottom", "andInsB4"],
      ["top", "andIns5"],
      ["bottom", "andInsB5"],
      ["top", "andIns6"],
      ["bottom", "andInsB6"],
      ["top", "andIns7"],
      ["bottom", "andInsB7"],
      ["top", "andIns8"],
      ["bottom", "andInsB8"],
      ["top", "andIns9"],
      ["bottom", "andInsB9"],
      ["top", "andIns10"],
      ["bottom", "andInsB10"],
      ["top", "andIns11"],
      ["bottom", "andInsB11"],
      ["top", "andIns12"],
      ["bottom", "andInsB12"],
      ["top", "andIns13"],
      ["bottom", "andInsB13"],
      ["top", "andIns14"],
      ["bottom", "andInsB14"],
      ["top", "andIns15"],
      ["bottom", "andInsB15"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),

  orIns: JSON.stringify({
    name: "nodeLine",
    x: 14,
    y: 1,
    amount: 16,
  }),
  orInsB: JSON.stringify({
    name: "nodeLine",
    x: 14,
    y: 37,
    amount: 16,
  }),
  or: JSON.stringify({
    name: "multiBitOr",
    position: [13, 3],
    bit: 16,
    nodes: [
      ["top", "orIns0"],
      ["bottom", "orInsB0"],
      ["top", "orIns1"],
      ["bottom", "orInsB1"],
      ["top", "orIns2"],
      ["bottom", "orInsB2"],
      ["top", "orIns3"],
      ["bottom", "orInsB3"],
      ["top", "orIns4"],
      ["bottom", "orInsB4"],
      ["top", "orIns5"],
      ["bottom", "orInsB5"],
      ["top", "orIns6"],
      ["bottom", "orInsB6"],
      ["top", "orIns7"],
      ["bottom", "orInsB7"],
      ["top", "orIns8"],
      ["bottom", "orInsB8"],
      ["top", "orIns9"],
      ["bottom", "orInsB9"],
      ["top", "orIns10"],
      ["bottom", "orInsB10"],
      ["top", "orIns11"],
      ["bottom", "orInsB11"],
      ["top", "orIns12"],
      ["bottom", "orInsB12"],
      ["top", "orIns13"],
      ["bottom", "orInsB13"],
      ["top", "orIns14"],
      ["bottom", "orInsB14"],
      ["top", "orIns15"],
      ["bottom", "orInsB15"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  muxIns: JSON.stringify({
    name: "nodeLine",
    x: 39,
    y: 40,
    amount: 16,
  }),
  muxInsB: JSON.stringify({
    name: "nodeLine",
    x: 39,
    y: 76,
    amount: 16,
  }),
  muxS: {
    elementName: "node",
    elementProps: {
      position: [36, 58],
    },
  },
  mux: JSON.stringify({
    name: "multiBitMux",
    position: [38, 42],
    bit: 16,
    nodes: [
      ["top", "muxIns0"],
      ["top", "muxIns1"],
      ["top", "muxIns2"],
      ["top", "muxIns3"],
      ["top", "muxIns4"],
      ["top", "muxIns5"],
      ["top", "muxIns6"],
      ["top", "muxIns7"],
      ["top", "muxIns8"],
      ["top", "muxIns9"],
      ["top", "muxIns10"],
      ["top", "muxIns11"],
      ["top", "muxIns12"],
      ["top", "muxIns13"],
      ["top", "muxIns14"],
      ["top", "muxIns15"],
      ["bottom", "muxInsB0"],
      ["bottom", "muxInsB1"],
      ["bottom", "muxInsB2"],
      ["bottom", "muxInsB3"],
      ["bottom", "muxInsB4"],
      ["bottom", "muxInsB5"],
      ["bottom", "muxInsB6"],
      ["bottom", "muxInsB7"],
      ["bottom", "muxInsB8"],
      ["bottom", "muxInsB9"],
      ["bottom", "muxInsB10"],
      ["bottom", "muxInsB11"],
      ["bottom", "muxInsB12"],
      ["bottom", "muxInsB13"],
      ["bottom", "muxInsB14"],
      ["bottom", "muxInsB15"],
      ["left", "muxS"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
};

export const arithmetic: JsonGateDict = {
  declare: {
    ...stdLib,
  },

  halfAdderA0: {
    elementName: "node",
    elementProps: {
      position: [1, 2],
    },
  },
  halfAdderB0: {
    elementName: "node",
    elementProps: {
      position: [1, 4],
    },
  },
  halfAdderXOR: JSON.stringify({
    name: "xor",
    position: [6, 1],
    nodes: [
      ["left", "halfAdderA0Joint"],
      ["left", "halfAdderB0Joint"],
      ["right", "out"],
    ],
  }),
  halfAdderA0Joint: {
    elementName: "node",
    elementProps: {
      position: [3, 2],
      invisible: true,
    },
    connect: "halfAdderA0",
  },
  halfAdderB0Joint: {
    elementName: "node",
    elementProps: {
      position: [4, 4],
      invisible: true,
    },
    connect: "halfAdderB0",
  },
  halfAdderA0Joint2: {
    elementName: "node",
    elementProps: {
      position: [3, 7],
      invisible: true,
    },
    connect: "halfAdderA0Joint",
  },
  halfAdderB0Joint2: {
    elementName: "node",
    elementProps: {
      position: [4, 9],
      invisible: true,
    },
    connect: "halfAdderB0Joint",
  },
  halfAdderAnd: JSON.stringify({
    name: "and",
    position: [6, 6],
    nodes: [
      ["left", "halfAdderA0Joint2"],
      ["left", "halfAdderB0Joint2"],
      ["right", "out"],
    ],
  }),
  halfAdderSumOut: {
    elementName: "node",
    elementProps: {
      position: [12, 3],
      label: "sum",
      await: "halfAdderXOR0out0",
    },
    connect: "halfAdderXOR0out0",
  },
  halfAdderCarryOut: {
    elementName: "node",
    elementProps: {
      position: [12, 8],
      label: "carry",
      await: "halfAdderAnd0out0",
    },
    connect: "halfAdderAnd0out0",
  },
  label: {
    elementName: "node",
    elementProps: {
      position: [13, 11],
      label: "HALF-ADDER",
      invisible: true,
    },
  },
  hAddA: {
    elementName: "node",
    elementProps: {
      position: [18, 4],
    },
  },
  hAddB: {
    elementName: "node",
    elementProps: {
      position: [18, 6],
    },
  },
  halfAdder: JSON.stringify({
    name: "halfAdder",
    position: [20, 3],
    nodes: [
      ["left", "hAddA"],
      ["left", "hAddB"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  fullInA: {
    elementName: "node",
    elementProps: {
      position: [34, 2],
    },
  },
  fullInB: {
    elementName: "node",
    elementProps: {
      position: [34, 4],
    },
  },
  fullInH0: JSON.stringify({
    name: "halfAdder",
    position: [36, 1],
    nodes: [
      ["left", "fullInA"],
      ["left", "fullInB"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  carryIn: {
    elementName: "node",
    elementProps: {
      position: [34, 8],
      label: "carry in",
    },
  },
  carryInJoint1: {
    elementName: "node",
    elementProps: {
      position: [44, 8],
      invisible: true,
    },
    connect: "carryIn",
  },
  carryInJoint2: {
    elementName: "node",
    elementProps: {
      position: [44, 4],
      invisible: true,
    },
    connect: "carryInJoint1",
  },
  fullInH1: JSON.stringify({
    name: "halfAdder",
    position: [46, 1],
    nodes: [
      ["left", "fullInH00out0"],
      ["left", "carryInJoint2"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  fullInH0CarryJoint: {
    elementName: "node",
    elementProps: {
      position: [42, 4],
      await: "fullInH00out1",
      invisible: true,
    },
    connect: "fullInH00out1",
  },
  fullInH0CarryJoint2: {
    elementName: "node",
    elementProps: {
      position: [42, 9],
      await: "fullInH0CarryJoint",
      invisible: true,
    },
    connect: "fullInH0CarryJoint",
  },
  carryOR: JSON.stringify({
    name: "or",
    position: [52, 6],
    nodes: [
      ["left", "fullInH10out1"],
      ["left", "fullInH0CarryJoint2"],
      ["right", "out"],
    ],
  }),
  fullSumOut: {
    elementName: "node",
    elementProps: {
      position: [60, 2],
      label: "sum",
      await: "fullInH10out0",
    },
    connect: "fullInH10out0",
  },
  fullCarryOut: {
    elementName: "node",
    elementProps: {
      position: [60, 5],
      label: "carry",
      await: "carryOR0out0",
    },
    connect: "carryOR0out0",
  },

  fullInA0: {
    elementName: "node",
    elementProps: {
      position: [68, 2],
    },
  },
  fullInB0: {
    elementName: "node",
    elementProps: {
      position: [68, 4],
    },
  },
  fullInC0: {
    elementName: "node",
    elementProps: {
      position: [68, 6],
    },
  },
  fullAdder: JSON.stringify({
    name: "fullAdder",
    position: [70, 1],
    nodes: [
      ["left", "fullInA0"],
      ["left", "fullInB0"],
      ["left", "fullInC0"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),

  aLine: JSON.stringify({
    name: "nodeLine",
    x: 1,
    y: 50,
    amount: 16,
    spacing: 8,
  }),
  bLine: JSON.stringify({
    name: "nodeLine",
    x: 1,
    y: 60,
    amount: 16,
    spacing: 8,
  }),
  addStart: JSON.stringify({
    name: "halfAdder",
    position: [1, 52],
    nodes: [
      ["left", "aLine0"],
      ["left", "bLine0"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add0: JSON.stringify({
    name: "fullAdder",
    position: [11, 52],
    nodes: [
      ["left", "aLine1"],
      ["left", "bLine1"],
      ["left", "addStart0out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add1: JSON.stringify({
    name: "fullAdder",
    position: [19, 52],
    nodes: [
      ["left", "aLine2"],
      ["left", "bLine2"],
      ["left", "add00out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add2: JSON.stringify({
    name: "fullAdder",
    position: [27, 52],
    nodes: [
      ["left", "aLine3"],
      ["left", "bLine3"],
      ["left", "add10out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add3: JSON.stringify({
    name: "fullAdder",
    position: [35, 52],
    nodes: [
      ["left", "aLine4"],
      ["left", "bLine4"],
      ["left", "add20out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add4: JSON.stringify({
    name: "fullAdder",
    position: [43, 52],
    nodes: [
      ["left", "aLine5"],
      ["left", "bLine5"],
      ["left", "add30out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add5: JSON.stringify({
    name: "fullAdder",
    position: [51, 52],
    nodes: [
      ["left", "aLine6"],
      ["left", "bLine6"],
      ["left", "add40out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add6: JSON.stringify({
    name: "fullAdder",
    position: [59, 52],
    nodes: [
      ["left", "aLine7"],
      ["left", "bLine7"],
      ["left", "add50out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add7: JSON.stringify({
    name: "fullAdder",
    position: [67, 52],
    nodes: [
      ["left", "aLine8"],
      ["left", "bLine8"],
      ["left", "add60out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add8: JSON.stringify({
    name: "fullAdder",
    position: [75, 52],
    nodes: [
      ["left", "aLine9"],
      ["left", "bLine9"],
      ["left", "add70out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  add9: JSON.stringify({
    name: "fullAdder",
    position: [83, 52],
    nodes: [
      ["left", "aLine10"],
      ["left", "bLine10"],
      ["left", "add80out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  //add10 is a problem because add10 will happen from add1, apparently :/
  //Hex it is
  addA: JSON.stringify({
    name: "fullAdder",
    position: [91, 52],
    awaits: "add90out1",
    nodes: [
      ["left", "aLine11"],
      ["left", "bLine11"],
      ["left", "add90out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  addB: JSON.stringify({
    name: "fullAdder",
    position: [99, 52],
    nodes: [
      ["left", "aLine12"],
      ["left", "bLine12"],
      ["left", "addA0out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  addC: JSON.stringify({
    name: "fullAdder",
    position: [107, 52],
    nodes: [
      ["left", "aLine13"],
      ["left", "bLine13"],
      ["left", "addB0out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  addD: JSON.stringify({
    name: "fullAdder",
    position: [115, 52],
    nodes: [
      ["left", "aLine14"],
      ["left", "bLine14"],
      ["left", "addC0out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
  addE: JSON.stringify({
    name: "fullAdder",
    position: [123, 52],
    nodes: [
      ["left", "aLine15"],
      ["left", "bLine15"],
      ["left", "addD0out1"],
      ["right", "out"],
      ["right", "out"],
    ],
  }),
};
