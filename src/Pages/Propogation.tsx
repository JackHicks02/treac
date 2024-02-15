import App from "../App";
import Objectionable from "../components/DOOM/Objectionable";
import TestComponent from "../components/DOOM/TestComponent";
import PrototypePoint from "../components/ProtoTypes/PrototypePoint";
import PrototypeVector from "../components/ProtoTypes/PrototypeVector";

const testa = new Objectionable({});
const testb = new Objectionable({});
const testc = new Objectionable({});
const testd = new Objectionable({});
const teste = new Objectionable({});
const testf = new Objectionable({});
const testg = new Objectionable({});
const testh = new Objectionable({});

teste.pushSetter(testg.setState);
teste.pushSetter(testf.setState);
testc.pushSetter(testg.setState);
// testc.pushSetter(teste.setState);
testd.pushSetter(testh.setState);
testc.pushSetter(testd.setState);
testb.pushSetter(testc.setState);
testa.pushSetter(testb.setState);

function Propogation() {
  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100%",
        position: "relative",
        cursor: "crosshair",
      }}
    >
      <TestComponent
        name="a"
        setterFn={testa.setState}
        bindSetterFn={testa.bindChildSetter}
        getState={testa.getState}
        x={900}
        y={100}
      />
      <TestComponent
        name="b"
        setterFn={testb.setState}
        bindSetterFn={testb.bindChildSetter}
        getState={testb.getState}
        x={900}
        y={200}
      />
      <TestComponent
        name="c"
        setterFn={testc.setState}
        bindSetterFn={testc.bindChildSetter}
        getState={testc.getState}
        x={900}
        y={300}
      />
      <TestComponent
        name="d"
        setterFn={testd.setState}
        bindSetterFn={testd.bindChildSetter}
        getState={testd.getState}
        x={1200}
        y={300}
      />
      <TestComponent
        name="e"
        setterFn={teste.setState}
        bindSetterFn={teste.bindChildSetter}
        getState={teste.getState}
        x={600}
        y={300}
      />
      <TestComponent
        name="f"
        setterFn={testf.setState}
        bindSetterFn={testf.bindChildSetter}
        getState={testf.getState}
        x={400}
        y={400}
      />
      <TestComponent
        name="g"
        setterFn={testg.setState}
        bindSetterFn={testg.bindChildSetter}
        getState={testg.getState}
        x={800}
        y={400}
      />
      <TestComponent
        name="h"
        setterFn={testh.setState}
        bindSetterFn={testh.bindChildSetter}
        getState={testh.getState}
        x={1200}
        y={400}
      />
    </div>
  );
}

export default Propogation;
