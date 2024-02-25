import { FC, useMemo } from "react";
import { BitLine } from "../Squidward/Gates";
import { Coordinate } from "../../App";
import {
  NAND,
  SquareVectorFromObj,
  BitNode,
  BinaryGate,
  UnaryGate,
} from "./ExtensibleGates";
import {
  Dictionary,
  JsonGateDict,
  ElementArray,
  unFunc,
} from "../../types/types";

const Json2Elements = (
  JSON: JsonGateDict,
  bitLineObj: Dictionary<BitLine>,
  positionObj: Dictionary<Coordinate>
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
        positionObj[_key] = entry.elementProps.position;

        let CLine = !entry.connect
          ? new BitLine()
          : findConnection(entry.connect, _key)!;

        if (!entry.connect) {
          bitLineObj[_key] = CLine;
        } else {
          ElementArray.push(
            <SquareVectorFromObj
              key={
                JSON[entry.connect].elementProps.position +
                "-" +
                entry.elementProps.position
              }
              positionObj={positionObj}
              bitLine={CLine}
              originKey={entry.connect}
              destinationKey={_key}
            />
          );
        }
        ElementArray.unshift(
          <BitNode
            positionObj={positionObj}
            key={_key}
            keyID={_key}
            CLine={CLine}
            position={entry.elementProps.position}
            {...entry.elementProps}
          />
        );
        break;
      case "nand":
        bitLineObj[_key] = new BitLine(
          !(
            findConnection(entry.elementProps.A, _key)!.getBit() &&
            findConnection(entry.elementProps.B, _key)!.getBit()
          )
        );

        ElementArray.unshift(
          <NAND
            key={_key}
            keyID={_key}
            CLine={bitLineObj[_key]}
            ALine={findConnection(entry.elementProps.A, _key)!}
            BLine={findConnection(entry.elementProps.B, _key)!}
            positionObj={positionObj}
            position={entry.elementProps.position}
          />
        );

        ElementArray.push(
          <SquareVectorFromObj
            key={_key + "A"}
            positionObj={positionObj}
            originKey={entry.elementProps.A}
            destinationKey={_key + "A"}
            bitLine={findConnection(entry.elementProps.A, _key)!}
          />
        );
        ElementArray.push(
          <SquareVectorFromObj
            key={_key + "B"}
            positionObj={positionObj}
            originKey={entry.elementProps.B}
            destinationKey={_key + "B"}
            bitLine={findConnection(entry.elementProps.B, _key)!}
          />
        );
        break;
      case "binarygate":
        bitLineObj[_key] = new BitLine(
          entry.func!(
            findConnection(entry.elementProps.A, _key)!.getBit(),
            findConnection(entry.elementProps.B, _key)!.getBit()
          )
        );

        ElementArray.unshift(
          <BinaryGate
            func={entry.func!}
            key={_key}
            keyID={_key}
            CLine={bitLineObj[_key]}
            ALine={findConnection(entry.elementProps.A, _key)!}
            BLine={findConnection(entry.elementProps.B, _key)!}
            positionObj={positionObj}
            position={entry.elementProps.position}
            label={entry.elementProps.label ?? "ANON"}
          />
        );

        ElementArray.push(
          <SquareVectorFromObj
            key={_key + "A"}
            positionObj={positionObj}
            originKey={entry.elementProps.A}
            destinationKey={_key + "A"}
            bitLine={findConnection(entry.elementProps.A, _key)!}
          />
        );
        ElementArray.push(
          <SquareVectorFromObj
            key={_key + "B"}
            positionObj={positionObj}
            originKey={entry.elementProps.B}
            destinationKey={_key + "B"}
            bitLine={findConnection(entry.elementProps.B, _key)!}
          />
        );
        break;
      case "unarygate":
        const func = entry.func as unFunc;

        bitLineObj[_key] = new BitLine(
          func(findConnection(entry.elementProps.A, _key)!.getBit())
        );

        ElementArray.unshift(
          <UnaryGate
            func={entry.func as unFunc}
            key={_key}
            keyID={_key}
            CLine={bitLineObj[_key]}
            ALine={findConnection(entry.elementProps.A, _key)!}
            positionObj={positionObj}
            position={entry.elementProps.position}
            label={entry.elementProps.label ?? "ANON"}
          />
        );

        ElementArray.push(
          <SquareVectorFromObj
            key={_key + "A"}
            positionObj={positionObj}
            originKey={entry.elementProps.A}
            destinationKey={_key + "A"}
            bitLine={findConnection(entry.elementProps.A, _key)!}
          />
        );

        break;

      default:
        throw new Error(`No component by the name of ${entry.elementName}`);
    }
  });

  return ElementArray;
};

interface Json2GatesProps {
  dict?: JsonGateDict;
}

const Json2Gates: FC<Json2GatesProps> = ({ dict }) => {
  const bitLineObj: Dictionary<BitLine> = {};
  const positionObj: Dictionary<Coordinate> = {};
  console.log(dict);

  const phatTest = (count: number): JsonGateDict => {
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

  const testDict: JsonGateDict = dict ?? {
    //Connect refers to the "CLine", or output line, which is defined
    a: {
      elementName: "node",
      elementProps: { position: [100, 200], bs: 123, label: "In" }, // You can stick anything in here and typescript doesn't care unfortunately so this won't catch typos
    }, // Won't even warn the console
    b: {
      elementName: "node",
      elementProps: {
        position: [220, 177],
      },
      connect: "a",
    },
    c: {
      elementName: "node",
      elementProps: {
        position: [220, 224],
      },
      connect: "a",
    },
    bob: {
      elementName: "nand",
      elementProps: {
        position: [300, 200],
        A: "b",
        B: "c",
      },
    },
    out: {
      elementName: "node",
      elementProps: {
        position: [380, 200],
        label: "Out",
      },
      connect: "bob",
    },
  };

  const circuit = useMemo(
    () => Json2Elements(testDict, bitLineObj, positionObj),
    []
  ); // Not risking it

  return <>{circuit}</>;
};

export default Json2Gates;
