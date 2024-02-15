import NodesAndVectors from "../Pages/NodesAndVectors";
import Propogation from "../Pages/Propogation";
import Squidward from "../components/Squidward/Squidward";

type TabsDict = { [key: string]: JSX.Element };

export const tabsDict: TabsDict = {
  "Points n Vectors": <NodesAndVectors />,
  "Ordered propogation": <Propogation />,
  "Who knows": <Squidward />,
};
