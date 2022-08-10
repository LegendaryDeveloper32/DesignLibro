import React from "react";
import {
  IonContent,
  IonPage,
  IonLabel,
  IonInput,
  IonItem,
  IonRow,
  IonCol,
  IonButton,
  IonLoading,
  IonRouterLink,
} from "@ionic/react";
import firebase from "../firebase";
import { toast } from "../utils/toast";
import useFormValidation from "../hooks/useFormValidation";
import validatePasswordReset from "../components/Auth/validatePasswordReset";
import NavHeader from "../components/Header/NavHeader";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Header/Footer";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";

const INITIAL_STATE = {
  email: "",
};

const Forgot = (props) => {
  const { user, setUser } = React.useContext(UserContext);
  const {
    handleSubmit,
    handleChange,
    values,
    isSubmitting,
  } = useFormValidation(
    INITIAL_STATE,
    validatePasswordReset,
    handleResetPassword
  );

  const [busy, setBusy] = React.useState(false);

  async function handleResetPassword() {
    setBusy(true);
    const { email } = values;
    try {
      await firebase.resetPassword(email);
      toast("Check your email to reset your password.");
      props.history.push("/login");
    } catch (err) {
      console.error("Password Reset Error", err);
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
                <h3 className="subTitle text-center mb-4" style={{ fontSize: "28px" }}>Reset Password</h3>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange} />
                </div>
                {/* <div className="form-group mb-3">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="newPassword"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange} />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange} />
                </div> */}

              </div>
            </div>
            <div className="d-flex justify-content-center mb-3">
              <button className="btn btn-black px-lg rounded-0"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >Send</button>
            </div>
            <div className="d-flex justify-content-center">
              <span className="text-gray mr-2">We will send you link to reset password shortly. Or you can</span>
              <Link className="text-black font-weight-bold" to="/register">Sign Up</Link>
            </div>
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Forgot;