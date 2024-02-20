import { BitNode, XOR, AND, OR, BitLine } from "./Gates";
import Vector from "../ProtoTypes/Vector";
import SquareVector from "./SquareVector";

const bitLineA0 = new BitLine();
const bitLineB0 = new BitLine();
const bitLineXOROut = new BitLine(); //XOR OUT
const bitLineANDOut = new BitLine(); //AND OUT

const bitLineCIN = new BitLine();
const bitLineSumOut1 = new BitLine();
const bitLineANDOut1 = new BitLine();
const bitLineCarryOut = new BitLine();

const Squidward = () => {
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <SquareVector
        origin={[200, 200]}
        destination={[290, 200]}
        bitLine={bitLineA0}
      />
      <SquareVector
        origin={[200, 200]}
        destination={[290, 260]}
        bitLine={bitLineA0}
      />
      <SquareVector
        origin={[200, 260]}
        destination={[290, 200]}
        bitLine={bitLineB0}
      />
      <SquareVector
        origin={[200, 260]}
        destination={[290, 260]}
        bitLine={bitLineB0}
      />

      <SquareVector
        origin={[290, 200]}
        destination={[400, 240]}
        bitLine={bitLineXOROut}
      />
      <SquareVector
        origin={[200, 400]}
        destination={[400, 240]}
        bitLine={bitLineCIN}
      />
      <SquareVector
        origin={[200, 400]}
        destination={[400, 310]}
        bitLine={bitLineCIN}
      />
      <SquareVector
        origin={[290, 260]}
        destination={[500, 400]}
        bitLine={bitLineANDOut}
      />
      <SquareVector
        origin={[400, 310]}
        destination={[500, 400]}
        bitLine={bitLineANDOut1}
      />
      <SquareVector
        origin={[400, 240]}
        destination={[700, 200]}
        bitLine={bitLineSumOut1}
      />
      <SquareVector
        origin={[500, 400]}
        destination={[700, 240]}
        bitLine={bitLineCarryOut}
      />
      {/*half adder 1*/}
      <BitNode position={[200, 200]} CLine={bitLineA0} label="A0" />
      <BitNode position={[200, 260]} CLine={bitLineB0} label="B0" />
      <XOR ALine={bitLineA0} BLine={bitLineB0} CLine={bitLineXOROut} />
      <BitNode position={[290, 200]} CLine={bitLineXOROut} label="XOR" />
      <AND ALine={bitLineA0} BLine={bitLineB0} CLine={bitLineANDOut} />
      <BitNode position={[290, 260]} CLine={bitLineANDOut} label="AND" />
      {/* * * * * * * * ** * * * * *  * ** * *  ** * * * * * */}
      <BitNode position={[200, 400]} CLine={bitLineCIN} label="Cin" />
      <XOR ALine={bitLineXOROut} BLine={bitLineCIN} CLine={bitLineSumOut1} />
      <BitNode position={[400, 240]} CLine={bitLineSumOut1} label="XOR" />
      <AND ALine={bitLineXOROut} BLine={bitLineCIN} CLine={bitLineANDOut1} />
      <BitNode position={[400, 310]} CLine={bitLineANDOut1} label="AND" />
      <OR
        ALine={bitLineANDOut}
        BLine={bitLineANDOut1}
        CLine={bitLineCarryOut}
      />
      <BitNode position={[500, 400]} CLine={bitLineCarryOut} label="OR" />
      <BitNode position={[700, 200]} CLine={bitLineSumOut1} label="S1" />
      <BitNode position={[700, 240]} CLine={bitLineCarryOut} label="Cout" />
    </div>
  );
};

export default Squidward;
