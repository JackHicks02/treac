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
    x: 1,
    y: 2,
    amount: 16,
    vertical: true,
  }),

  not: JSON.stringify({
    name: "not",
    position: [3, 1],
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
    x: 9,
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
};
