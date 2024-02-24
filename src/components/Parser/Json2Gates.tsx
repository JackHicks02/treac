import { FC, useCallback, useMemo } from "react";
import { BitLine, BitNode, NAND } from "../Squidward/Gates";
import SquareVector from "../Squidward/SquareVector";

type Dictionary<T> = { [key: string]: T };

type MultiKeyDictionary<T> = Map<string[], T>; //Revisit this when you discover recursive depth

type GateEntry = {
  elementName: string;
  elementProps: Dictionary<any>;
  connect?: string;
};

type JsonGateDict = Dictionary<GateEntry>;

type ElementArray = Array<JSX.Element>;

const Json2Elements = (
  JSON: JsonGateDict,
  bitLineObj: Dictionary<BitLine>
): ElementArray => {
  const ElementArray: ElementArray = [];

  const findConnection = (key: string, currentNode: string): BitLine | null => {
    if (bitLineObj[key]) {
      return bitLineObj[key];
    }

    try {
      if (JSON[key].connect) {
        return findConnection(JSON[key].connect!, currentNode);
      } else {
        return null;
      }
    } catch {
      const err = `Error, Missing connection @ ${currentNode}`;
      throw new Error(err);
    }
  };

  Object.keys(JSON).forEach((_key) => {
    const entry = JSON[_key];

    switch (entry.elementName) {
      case "node":
        let CLine = !entry.connect
          ? new BitLine()
          : findConnection(entry.connect, _key)!;

        if (!entry.connect) {
          bitLineObj[_key] = CLine;
        } else {
          ElementArray.push(
            <SquareVector
              key={
                JSON[entry.connect].elementProps.position +
                "-" +
                entry.elementProps.position
              }
              bitLine={CLine}
              origin={JSON[entry.connect].elementProps.position}
              destination={entry.elementProps.position}
            />
          );
        }
        ElementArray.push(
          <BitNode key={_key} CLine={CLine} {...entry.elementProps} />
        );
        break;
      case "nand":
        bitLineObj[_key] = new BitLine(true);
        console.log(bitLineObj);
        console.log(findConnection(entry.elementProps.A, _key)!);

        ElementArray.push(
          <NAND
            key={_key}
            CLine={bitLineObj[_key]}
            ALine={findConnection(entry.elementProps.A, _key)!}
            BLine={findConnection(entry.elementProps.B, _key)!}
            {...entry.elementProps}
          />
        );

        ElementArray.push(
          <SquareVector
            key={
              JSON[entry.elementProps.A].elementProps.position +
              "-" +
              entry.elementProps.position
            }
            origin={JSON[entry.elementProps.A].elementProps.position}
            destination={entry.elementProps.position}
            bitLine={findConnection(entry.elementProps.A, _key)!}
          />
        );
        ElementArray.push(
          <SquareVector
            key={
              JSON[entry.elementProps.B].elementProps.position +
              "-" +
              entry.elementProps.position
            }
            origin={JSON[entry.elementProps.B].elementProps.position}
            destination={entry.elementProps.position}
            bitLine={findConnection(entry.elementProps.B, _key)!}
          />
        );
        break;
      default:
        throw new Error(`No component by the name of ${entry.elementName}`);
    }
  });

  return ElementArray;
};

const Json2Gates: FC = () => {
  const bitLineObj: { [key: string]: BitLine } = {};

  const fatTest = (count: number): JsonGateDict => {
    let myDict: JsonGateDict = {};
    for (let i = 0; i < count; i++) {
      const _key = i.toString();
      myDict[_key] = {
        elementName: "node",
        elementProps: { position: [20 + i * 20, 200] },
        ...(i !== 0 && { connect: (i - 1).toString() }),
      };
    }

    return myDict;
  };

  const testDict: JsonGateDict = {
    //Connect refers to the "CLine", or output line, which is defined
    a: {
      elementName: "node",
      elementProps: { position: [100, 200], bs: 123 }, // You can stick anything in here and typescript doesn't care unfortunately so this won't catch typos
    }, // Won't even warn the console
    b: {
      elementName: "node",
      elementProps: {
        position: [150, 150],
      },
      connect: "a",
    },
    c: {
      elementName: "node",
      elementProps: {
        position: [150, 250],
      },
      connect: "a",
    },
    nand: {
      elementName: "nand",
      elementProps: {
        position: [300, 200],
        A: "b",
        B: "c",
      },
    },
  };

  const circuit = useMemo(() => Json2Elements(testDict, bitLineObj), []); // Not risking it

  return <>{circuit}</>;
};

export default Json2Gates;
