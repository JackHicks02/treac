import NodesAndVectors from "../Pages/NodesAndVectors";

type TabsDict = { [key: string]: JSX.Element };

export const tabsDict: TabsDict = {
  "Points n Vectors": <NodesAndVectors />,
  "Ordered propogation": <div>Ordered propogation</div>,
};
