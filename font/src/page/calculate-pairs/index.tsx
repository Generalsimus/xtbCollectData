import { wsClient } from "../../ws-client";

interface CalculatePairsProps {
  pairs: string[];
}
export const CalculatePairs = async (props: CalculatePairsProps) => {
  const pairs = await wsClient.send("getStrongPairs", props.pairs, 1, 1);
  console.log("🚀 --> CalculatePairs --> pairs:", pairs);
  return <>{props.pairs}</>;
};
