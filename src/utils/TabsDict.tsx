import NodesAndVectors from "../Pages/NodesAndVectors";
import Propogation from "../Pages/Propogation";
import NANDPage from "../components/NAND/NANDPage";

import Squidward from "../components/Squidward/Squidward";

type TabsDict = { [key: string]: JSX.Element };

export const tabsDict: TabsDict = {
  "Points n Vectors": <NodesAndVectors />,
  "Ordered propogation": <Propogation />,
  Adder: <Squidward />,
  NAND: <NANDPage />,
};
