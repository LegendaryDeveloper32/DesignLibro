import React from "react";
import {
  IonPage,
  IonContent,
  IonRow,
  IonCol,
  IonButton,
  IonItem,
  IonInput,
  IonLabel,
  IonRouterLink,
  IonLoading,
} from "@ionic/react";
import { toast } from "../utils/toast";
import useFormValidation from "../hooks/useFormValidation";
import validateLogin from "../components/Auth/validateLogin";
import firebase from "../firebase";
import NavHeader from "../components/Header/NavHeader";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Header/Footer";
import SocialOAuth from "../components/SocialOAuth";
import UserContext from "../contexts/UserContext";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const INITIAL_STATE = {
  email: "",
  password: "",
};

const Login = (props) => {
  const history = useHistory();
  const auth = useSelector(state => state.auth);
  console.log(" auth : ", auth)
  const { initURL } = auth;
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);
  const [busy, setBusy] = React.useState(false);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    if (user) {
      history.push(initURL === '' || initURL === '/login' || initURL === '/login/' ? '/profile' : initURL);
    }
  }, [user]);

  async function authenticateUser() {
    setBusy(true);
    const { email, password } = values;
    try {
      await firebase.login(email, password);
      toast("You have logged in successfully!");
      history.push("/profile");
    } catch (err) {
      console.error("Authentication Error", err);
      toast(err.message);
    }
    setBusy(false);
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <Navbar title="DesignLibro" />
        <div className="row bg-white">
          <div className="col-5">
            <img src="/assets/images/login-bg.png" />
          </div>
          <div className="col-7">
            <div className="d-flex justify-content-center">
              <div className="loginForm mb-4">
                <h3 className="subTitle text-center mb-4" style={{ fontSize: "28px" }}>Log in</h3>
                {/* <SocialOAuth /> */}
                {/* <div className="breakLine mb-4">
                  <hr />
                  <span>Or</span>
                </div> */}
                <div className="form-group mb-3">
                  <label htmlFor="emailAddress">Email Address</label>
                  <input type="text"
                    name="email"
                    className="form-control"
                    id="emailAddress"
                    placeholder=""
                    value={values.email}
                    onChange={handleChange} />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="password">Password</label>
                  <input type="password"
                    name="password"
                    className="form-control mb-1"
                    id="password"
                    placeholder="6+ characters"
                    value={values.password}
                    onChange={handleChange} />
                  <Link to="/forgot">Forgot your password?</Link>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center mb-3">
              <button className="btn btn-black px-lg rounded-0"
                onClick={handleSubmit}
                disabled={isSubmitting}>Sign In</button>
            </div>
            <div className="d-flex justify-content-center">
              <span className="text-gray mr-2">Don't have an account? </span>
              <Link className="text-black font-weight-bold" to="/register">Sign Up</Link>
            </div>
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Login;