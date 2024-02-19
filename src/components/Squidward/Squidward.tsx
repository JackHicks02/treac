import { BitNode, XOR, AND, OR, BitLine } from "./Gates";
import Vector from "../ProtoTypes/Vector";

//This is probably unesccesarily slow even if it is more reusable
// const and = (a: boolean, b: boolean) => {
//   return a && b;
// };

// const or = (a: boolean, b: boolean) => {
//   return a || b;
// };

// const not = (a: boolean) => {
//   return !a;
// };

// Ask dem what to do here, whether this shouldn't exist and should just be replaced with the class (or something else entirely)?
// export type LineWithListener = {
//   bitLine: BitObj;
//   bitLineListeners: BitLineListener[];
// };

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
      {/*half adder 1*/}
      <BitNode position={[200, 200]} CLine={bitLineA0} label="A0" />
      <Vector origin={[200, 200]} destination={[290, 200]} />
      <Vector origin={[200, 200]} destination={[290, 260]} />

      <BitNode position={[200, 260]} CLine={bitLineB0} label="B0" />
      <Vector origin={[200, 260]} destination={[290, 200]} />
      <Vector origin={[200, 260]} destination={[290, 260]} />

      <XOR ALine={bitLineA0} BLine={bitLineB0} CLine={bitLineXOROut} />
      <BitNode position={[290, 200]} CLine={bitLineXOROut} label="XOR" />

      <AND ALine={bitLineA0} BLine={bitLineB0} CLine={bitLineANDOut} />
      <BitNode position={[290, 260]} CLine={bitLineANDOut} label="AND" />

      {/* * * * * * * * ** * * * * *  * ** * *  ** * * * * * */}
      <Vector origin={[290, 200]} destination={[400, 240]} />
      <BitNode position={[200, 400]} CLine={bitLineCIN} label="Cin" />
      <Vector origin={[200, 400]} destination={[400, 240]} />
      <XOR ALine={bitLineXOROut} BLine={bitLineCIN} CLine={bitLineSumOut1} />
      <BitNode position={[400, 240]} CLine={bitLineSumOut1} label="XOR" />

      <AND ALine={bitLineXOROut} BLine={bitLineCIN} CLine={bitLineANDOut1} />
      <Vector origin={[200, 400]} destination={[400, 310]} />
      <Vector origin={[290, 200]} destination={[400, 310]} />
      <BitNode position={[400, 310]} CLine={bitLineANDOut1} label="AND" />
      <OR
        ALine={bitLineANDOut}
        BLine={bitLineANDOut1}
        CLine={bitLineCarryOut}
      />
      <Vector origin={[290, 260]} destination={[500, 400]} />
      <Vector origin={[400, 310]} destination={[500, 400]} />
      <BitNode position={[500, 400]} CLine={bitLineCarryOut} label="OR" />

      <Vector origin={[400, 240]} destination={[700, 200]} />
      <BitNode position={[700, 200]} CLine={bitLineSumOut1} label="S1" />
      <Vector origin={[500, 400]} destination={[700, 240]} />
      <BitNode position={[700, 240]} CLine={bitLineCarryOut} label="Cout" />
    </div>
  );
};

export default Squidward;
