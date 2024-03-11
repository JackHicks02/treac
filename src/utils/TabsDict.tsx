import { GridPage } from "../Pages/GridTest";
import NodesAndVectors from "../Pages/NodesAndVectors";
import Parser from "../Pages/Parser";
import Propogation from "../Pages/Propogation";
import { multibitNot } from "../circuits";
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
  Grid: <Json2Grid key="grid standard" />,
  GridTest: <GridPage />,
  Parser: <Parser />,
};

export const Nand2Infinity: TabsDict = {
  "Two bit gates": <NAND2GATES />,
  "Multi bit Not": <Json2Grid dict={multibitNot} height={200} key="unique" />,
};
