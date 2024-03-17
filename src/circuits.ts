import _ from "lodash";
import { Dictionary, GateEntry, JsonGateDict } from "./types/types";

const stdLib = {
  nodeLine: ({ x, y, amount, vertical, connects, awaits }: Dictionary<any>) => {
    const nodes: Dictionary<GateEntry> = {};
    for (let i = 0; i < amount; i++) {
      nodes[i] = {
        elementName: "node",
        elementProps: {
          position: [x + (!vertical ? 2 * i : 0), y + (vertical ? 2 * i : 0)],
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
  multiWayOr: ({ position, nodes }: Dictionary<any>) => {
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
};

export const multiBitAnd: JsonGateDict = {
  declare: {
    //name must be first parameter
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
