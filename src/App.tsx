import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import Microfrontend from "./components/MIcrofrontend.component";
import Missing from "./components/Missing.component";
import { Homepage } from "./pages/Homepage";

let routes: Array<any> = [];

let getContracts = async () => {
  try {
    let result = await axios.get("http://127.0.0.1:3003/contracts.json");
    let data = result.data;
    return data;
  } catch (e) {
    return {};
  }
};

let getRoutes = async () => {
  let result = null;
  try {
    result = await axios.get("http://127.0.0.1:3003/contracts.json");
    let data = result.data;
    for (let contract in data) {
      if (data.hasOwnProperty(contract)) {
        let currentContract = data[contract];
        routes.push(
          <Route
            key={currentContract.name}
            path={`/${currentContract.route}`}
            component={({ history }: { history: any }) => {
              return (
                <Microfrontend
                  history={history}
                  name={currentContract.name}
                  host={currentContract.host || ""}
                ></Microfrontend>
              );
            }}
          />
        );
      }
    }
  } catch (e) {
    return e;
  }
  return routes;
};

class App extends React.Component {
  state: { routes: Array<any>; contracts: any } = { routes: [], contracts: {} };
  componentDidMount() {
    Promise.all([getRoutes(), getContracts()]).then(result => {
      this.setState({ routes: result[0], contracts: result[1] });
    });
  }
  render() {
    let finalRoutes = this.state.routes;
    return (
      <BrowserRouter>
        <Switch>
          {finalRoutes.length ? finalRoutes : null}
          <Route
            path={"/configure_contract"}
            component={() => {
              return null;
            }}
          />
          <Route
            path="/"
            render={props => <Homepage contracts={this.state.contracts} />}
            exact
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
