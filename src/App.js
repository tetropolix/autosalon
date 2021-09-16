import CarsPage from "./components/CarsPage/CarsPage";
import { Paper, makeStyles } from "@material-ui/core";
import Header from "./common/Header/Header";
import { Route, Switch } from "react-router-dom";
import NewCarPage from "./components/NewCarPage/NewCarPage";
import NewManuPage from "./components/NewManuPage/NewManuPage";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  paper: {
    maxWidth: 1260,
    margin: "auto",
    height: "100%",
  },
});

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <Paper className={classes.paper} elevation={2}>
        <Switch>
          <Route path="/addManu">
            <NewManuPage />
          </Route>
          <Route path="/addCar">
            <NewCarPage />
          </Route>
          <Route path="/">
            <CarsPage />
          </Route>
        </Switch>
      </Paper>
    </div>
  );
}

export default App;
