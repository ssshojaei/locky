import React from "react";
import { Switch, Route, HashRouter, BrowserRouter } from "react-router-dom";
import routes from "./routes";

export default () => (
  <BrowserRouter>
    <HashRouter>
      <Switch>
        {routes.map((route, index) => (
          <Route key={index} {...route} />
        ))}
      </Switch>
    </HashRouter>
  </BrowserRouter>
);
