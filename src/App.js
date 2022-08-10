import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  listCircleOutline,
  searchOutline,
  personCircleOutline,
  createOutline,
  trendingUpOutline,
} from "ionicons/icons";
import Home from "./pages/Home";
import BrandSubmit from "./pages/BrandSubmit";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import useAuth from "./hooks/useAuth";
import useDetailAuth from "./hooks/useDetailAuth";
import UserContext from "./contexts/UserContext";
import Designers from "./pages/Designers";
import Brands from "./pages/Brands";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import QuickProfile from "./pages/QuickProfile";
import DesignerProfile from "./pages/DesignerProfile";
import EditProfile from "./pages/EditProfile";
import UserDetailContext from "./contexts/UserDetailContext";
import ProductUpdate from "./pages/ProductUpdate";
import AdminLogin from "./pages/AdminLogin";
import { Provider } from "react-redux";
import configureStore from "./store";

export const store = configureStore();

const Admin = () => {
  return (
    <Switch>
      <Redirect exact from="/admin" to="/admin/login" />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/product/update" component={ProductUpdate} />
      <Route path="/admin/brand/submit" component={BrandSubmit} />
    </Switch>
  );
}
const App = () => {
  const [user, setUser] = useAuth();
  const [userDetail, setUserDetail] = useDetailAuth({ user });
  console.log(" userDetail =========> ", userDetail)
  return (
    <IonApp>
      <Provider store={store}>
        <Router>
          <UserContext.Provider value={{ user, setUser }}>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
              <Switch>
                <Route
                  path="/"
                  render={() => <Redirect to="/home" />}
                  exact={true}
                />
                <Route path="/home" component={Home} />
                <Route path="/product/:productId" component={Product} />
                <Route path="/designers" component={Designers} />
                <Route path="/brands" component={Brands} />
                <Route path="/brands/:brandId" component={Brands} />
                <Route path="/admin" component={Admin} />
                <Route path="/search/:string" component={Search} />
                <Route path="/profile" component={Profile} />
                <Route path="/edit-profile" component={EditProfile} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/forgot" component={Forgot} />
                <Route component={() => <Redirect to="/home" />} />
              </Switch>
            </UserDetailContext.Provider>
          </UserContext.Provider>
        </Router>
      </Provider>
    </IonApp>
  );
};
export default App;