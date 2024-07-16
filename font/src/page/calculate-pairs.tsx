import { wsClient } from "../ws-client";

interface CalculatePairsProps {
  pairs: string[];
}
export const CalculatePairs = async (props: CalculatePairsProps) => {
  const pairs = await wsClient.send("getStrongPairs", props.pairs);
  console.log("🚀 --> CalculatePairs --> pairs:", pairs);
  return <>{props.pairs}</>;
};
