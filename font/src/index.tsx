import kix, { ComponentProps } from "kix";
import "./style.scss";
import { AddPageButton, chooseRoutes, StateChooseRouteType } from "./add-page-button";
import path from "path";
import { localStorageState } from "./utils/localStorageState";




const Container = () => {
  let routesState = localStorageState<{
    routes: StateChooseRouteType[]
  }>({ routes: [] }, "xtb-pages")

  const onAddPage = (newPage: StateChooseRouteType) => {
    routesState.routes = [...routesState.routes, newPage];
  }

  return (
    <div class="flex column flex-1">
      <div class="flex row bottom-line mb-5">
        {routesState.routes.map(route => {
          return <route-link
            href={route.path}
            class="p-10 hover-button"
            style={`background-color:white;color:black;`}
          >{route.label}</route-link>
        })}
        <AddPageButton onAdd={onAddPage} />
      </div>
      <div class="flex flex-1 w-100 h-100 column">
        {routesState.routes.map(route => {
          const el = chooseRoutes.find(item => (item.label === route.value))
          if (el) {
            console.log("🚀 --> Container --> el:", el);
            const Component = el.Component;
            return <route-switch path={route.path} unique={true} component={<Component route={route} routesState={routesState} />} />
          }
        })}
      </div>
    </div>
  );
};

kix(document.body, <Container />);
