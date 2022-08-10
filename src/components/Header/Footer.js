import React from 'react'
import useFormValidation from '../../hooks/useFormValidation';
import validateSubscribeForm from './validateSubscribeForm';
import firebase from "../../firebase";
import { toast } from '../../utils/toast';

export default function Footer() {
  const INITIAL_STATE = {
    email: ""
  };
  const [busy, setBusy] = React.useState(false);

  const {
    handleSubmit,
    handleChange,
    setValues,
    values,
    isSubmitting,
  } = useFormValidation(INITIAL_STATE, validateSubscribeForm, subscribeToNews);

  function subscribeToNews() {
    setBusy(true);
    const { email } = values;
    const subcribedAt = new Date();
    firebase.db.collection("subcriptionList")
      .add({ email, subcribedAt })
      .then(() => {
        setBusy(false);
        toast("Subscribe succeed !")
        console.log("Document successfully written!");
      })
      .catch((error) => {
        setBusy(false);
        toast("Subscribe failed !")
        console.error("Error writing document: ", error);
      });
  }
  return (
    <footer className="page-footer font-small">
      <div className="container-fluid text-center text-md-left">
        <div className="row">
          <hr className="clearfix w-100 d-md-none pb-3" />
          <div className="col-md-3 mb-md-0 mb-3">
            <h5 className="mb-3">Info</h5>
            <ul className="list-unstyled">
              <li><a href="#">Shop</a></li>
              <li><a href="#">Help</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-md-0 mb-3">
            <h5 className="mb-3">Get informed</h5>
            <ul className="list-unstyled">
              <li><a href="#">(406) 555-0120</a></li>
              <li><a href="#">trungkienspktnd@gmail.com</a></li>
              <li>
                <span className="mr-3"><a href="#"><i className="fa fa-facebook-f" /></a></span>
                <span className="mr-3"><a href="#"><i className="fa fa-instagram" /></a></span>
                <span className="mr-3"><a href="#"><i className="fa fa-twitter" /></a></span>
              </li>
            </ul>
          </div>
          <div className="col-md-6 mt-md-0 mt-3">
            <h5 className="mb-3">Subscribe to our news</h5>
            <div className="input-group subcribe-form mb-3">
              <input type="email"
                className="form-control rounded-0"
                placeholder="Your email*"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              <div className="input-group-append">
                <button className="btn btn-black px-default py-2 rounded-0" type="button" onClick={handleSubmit}>Send</button>
              </div>
            </div>
          </div>
          {/* Grid column */}
        </div>
      </div>
      <div className="footer-img-section">
        <img src="/assets/images/icons-images/lamp.png" />
      </div>
    </footer>

  )
}
