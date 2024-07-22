import { StateChooseRouteType } from "src/add-page-button";
import { CalculatePairs } from ".";
import { ChooseInput } from "./choose-inpute";

export const StrongPairPaige = (args: {
  route: StateChooseRouteType
  routesState: {
    routes: StateChooseRouteType[];
  }
}) => {
  let options = ["USD", "JPY"];
  let values: string[] = [];
  let calculatePairs: string[] | undefined;
  const startCalculate = () => {
    calculatePairs = undefined;
    calculatePairs = values;
  };
  return (
    <>
      <div class="gap-row-2">
        <ChooseInput
          options={options}
          values={values}
          onChange={(newValues) => {
            values = newValues;
          }}
        />
        <button class="button is-dark" onClick={startCalculate}>
          Calculate
        </button>
      </div>
      {calculatePairs && <CalculatePairs pairs={calculatePairs} />}
    </>
  );
};
