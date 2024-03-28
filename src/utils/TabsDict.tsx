import { GridPage } from "../Pages/GridTest";
import NodesAndVectors from "../Pages/NodesAndVectors";
import Parser from "../Pages/Parser";
import Propogation from "../Pages/Propogation";
import {
  alu,
  arithmetic,
  multiBitAnd,
  sequentialLogic,
  simulator,
} from "../circuits";
import NAND2GATES from "../components/NAND/NANDPage";
import Json2Gates from "../components/Parser/Json2Gates";
import Json2Grid from "../components/Parser/Json2Grid";

import Squidward from "../components/Squidward/Squidward";
import { Dictionary } from "../types/types";

type TabsDict = Dictionary<JSX.Element>;

export const tabsDict: TabsDict = {
  "Points n Vectors": <NodesAndVectors />,
  "Ordered propogation": <Propogation />,
  Adder: <Squidward />,
  JSON: <Json2Gates />,
  Grid: <Json2Grid />,
  GridTest: <GridPage />,
  Parser: <Parser />,
};

export const Nand2Infinity: TabsDict = {
  Nand2Gates: <NAND2GATES />,
  "Multi-bit Gates": (
    <Json2Grid dict={multiBitAnd} height={200} key="multiBitAnd" />
  ),
  Arithmetic: <Json2Grid dict={arithmetic} height={200} key="Arithmetic" />,
  ALU: <Json2Grid dict={alu} height={200} width={400} key="alu" />,
  Simulator: (
    <Json2Grid dict={simulator} height={200} width={400} key="simulator" />
  ),
  "Sequential Logic": (
    <Json2Grid dict={sequentialLogic} height={200} width={400} key="seqLogic" />
  ),
};
