import kix from "kix";
import "./style.scss";
import { StrongPairPaige } from "./page/calculate-pairs/strong-pair";
import { Chart } from "./page/chart";

const Container = () => {
  return (
    <div class="flex column flex-1">
      <div class="flex row bottom-line mb-5">
        <route-link
          href="/"
          class="p-10 hover-button"
          style={`background-color:white;color:black;`}
        >
          Chart
        </route-link>
        <route-link
          href="/strong-pair "
          class="p-10 hover-button"
          style={`background-color:white;color:black;`}
        >
          Strong pair
        </route-link>
      </div>
      <div class="flex flex-1 w-100 h-100 column">
        <route-switch path="/" unique={true} component={<Chart />} />
        <route-switch path="/strong-pair" component={<StrongPairPaige />} />
      </div>
    </div>
  );
};

kix(document.body, <Container />);
