import React from "react";
import {
  IonPage,
  IonContent,
  IonRow,
  IonCol,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonLoading,
  IonRouterLink,
} from "@ionic/react";
import { toast } from "../utils/toast";
import useFormValidation from "../hooks/useFormValidation";
import validateSignup from "../components/Auth/validateSignup";
import firebase from "../firebase";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Header/Footer";
import SocialOAuth from "../components/SocialOAuth";
import { useSelector } from "react-redux";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";

const INITIAL_STATE = {
  displayName: "",
  userName: "",
  email: "",
  password: ""
};

const Register = (props) => {
  const { history } = props;
  const { user } = React.useContext(UserContext);
  const { initURL } = useSelector(state => state.auth);
  React.useEffect(() => {
    if (user) {
      history.push(initURL === '' || initURL === '/login' || initURL === '/login/' ? '/home' : initURL);
    }
  }, [user]);

  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
  } = useFormValidation(INITIAL_STATE, validateSignup, authenticateUser);
  const [busy, setBusy] = React.useState(false);
  const [termAgreed, setTermAgreed] = React.useState(false);

  async function authenticateUser() {
    setBusy(true);
    const { displayName, userName, email, password } = values;
    if (!termAgreed) {
      toast("Term & Policy agreement is required.");
      return;
    }
    try {
      await firebase.register(displayName, userName, email, password);
      toast("You have signed up successfully!");
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
        <div className="row">
          <div className="col-5">
            <img src="/assets/images/login-bg.png" />
          </div>
          <div className="col-7">
            <div className="d-flex justify-content-center">
              <div className="signUpForm mb-4">
                <h3 className="subTitle text-center mb-4" style={{ fontSize: "28px" }}>Sign Up</h3>
                {/* <SocialOAuth /> */}
                {/* <div className="breakLine mb-4">
                  <hr />
                  <span>Or</span>
                </div> */}
                <div className="form-group mb-3">
                  <label htmlFor="displayName">Name</label>
                  <input
                    name="displayName"
                    type="text"
                    className="form-control"
                    id="displayName"
                    value={values.displayName}
                    onChange={handleChange} />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="userName">Username</label>
                  <input
                    name="userName"
                    type="text"
                    className="form-control"
                    id="userName"
                    value={values.userName}
                    onChange={handleChange} />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    name="email"
                    type="text"
                    className="form-control"
                    id="email"
                    value={values.email}
                    onChange={handleChange} />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control mb-1"
                    id="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="6+ characters" />
                </div>
                <div className="form-check mb-1">
                  <input
                    name="termAgreed"
                    className="form-check-input"
                    type="checkbox"
                    id="termAgreement"
                    checked={termAgreed}
                    onChange={() => setTermAgreed(!termAgreed)} />
                  <label className="form-check-label" htmlFor="termAgreement">Creating an account means you're okay with <Link className="text-primary" to="/term">Terms of Service</Link> and <Link className="text-primary" to="/privacy">Privacy Policy</Link></label>
                </div>

              </div>
            </div>
            <div className="d-flex justify-content-center mb-3">
              <button className="btn btn-black px-lg rounded-0"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >Create account</button>
            </div>
            <div className="d-flex justify-content-center">
              <span className="text-gray mr-2">Already a member? </span>
              <Link className="text-black font-weight-bold" to="/login">Sign In</Link>
            </div>
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Register;