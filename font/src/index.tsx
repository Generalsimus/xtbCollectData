import kix from "kix";
import "./style.scss";
import "./bulma.min.css";
import { StrongPairPaige } from "./page/strong-pair";

const Container = () => {
  return (
    <div >
      <div class="tabs" >
        <ul>
          <li class="is-active">
            <route-link href="/">Chart</route-link>
          </li>
          <li>
            <route-link href="/strong-pair">Strong pair</route-link>
          </li>
        </ul>
      </div>
      <route-switch path="/" unique={true} component={<h1>PAGE 1</h1>} />
      <route-switch path="/strong-pair" component={<StrongPairPaige />} />
    </div>
  );
};

kix(document.body, <Container />);
