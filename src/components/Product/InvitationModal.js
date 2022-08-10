import React, { useRef } from 'react'
import useOnclickOutside from "react-cool-onclickoutside";
import useFormValidation from '../../hooks/useFormValidation';
import firebase from '../../firebase';
import UserContext from '../../contexts/UserContext';
import { useHistory } from 'react-router';
import validateApplyInfluencer from './validateApplyInfluencer';
import { toast } from '../../utils/toast';
import clsx from 'clsx';

const INITIAL_STATE = {
   firstName: "",
   lastName: "",
   invitationCode: ""
};

export default function InvitationModal(props) {
   const { user } = React.useContext(UserContext);
   const history = useHistory();
   const { setIsModalOpen, setIsInfluencer, setIsRecommendModalOpen } = props;

   const [status, setStatus] = React.useState("init");
   const [submitting, setSubmitting] = React.useState(false);
   const ref = useOnclickOutside(() => {
      setIsModalOpen(false);
   });
   const handleClickClose = () => setIsModalOpen(false);
   const { handleSubmit, handleChange, values } = useFormValidation(
      INITIAL_STATE,
      validateApplyInfluencer,
      handleApply
   );
   async function handleApply() {
      try {
         if (!user) {
            history.push("/login");
            return;
         }
         setSubmitting(true);
         const {
            invitationCode
         } = values;
         const usersRef = firebase.db
            .collection("userProfiles")
            .where('uid', '==', user.uid)
            .get()
            .then(async querySnapshot => {
               if (!querySnapshot.empty) {
                  const userDoc = querySnapshot.docs[0];
                  const userDetail = userDoc.data();
                  if (userDetail.invitationCode === invitationCode) {
                     await userDoc.ref.update({
                        isInfluencer: true,
                        // displayName: firstName + " " + lastName
                     });
                     // await user.updateProfile({ displayName: firstName + " " + lastName });
                     setStatus("success");
                  } else {
                     setStatus("failed");
                  }
               } else {
                  console.log('No such document!');
               }
            });
      } catch (e) {
         console.error(e);
         toast(e.message);
         setSubmitting(false);
      }
   }

   const handleClickProductRecommend = () => {
      setIsModalOpen(false);
      setIsInfluencer(true);
      setIsRecommendModalOpen(true);
   }
   const handleClickLater = () => {
      setIsModalOpen(false);
      setIsInfluencer(true);
      setIsRecommendModalOpen(false);
   }

   let subTitle = null;
   if (status == "init") subTitle = <h3 className="section-title text-center">The Application is by invitation only</h3>;
   else if (status == "success") subTitle =
      <div>
         <h3 className="section-title text-center">Congratulations</h3>
         <p className="text-center px-2">You can now make produce recommendations and grow followers</p>
      </div>;
   else subTitle = <h3 className="section-title text-center">The invitaion code is Invalid, try again</h3>;

   return (
      <div className="bg-modal-gray">
         <div className="product-recommend-modal" ref={ref} style={{ marginTop: "-320px" }}>
            <button className="toggle-btn" onClick={handleClickClose}>
               <img src="/assets/images/close.png" alt="..." />
            </button>
            {subTitle}
            <div className="d-flex justify-content-center">
               <div className={clsx("recommend-form", status === "success" ? "d-none" : "")}>
                  <div className="form-group mb-5">
                     <label htmlFor="invitationCode">Invitation Code</label>
                     <input
                        type="text"
                        className="form-control"
                        id="invitationCode"
                        name="invitationCode"
                        placeholder=""
                        onChange={handleChange}
                        value={values.invitationCode} />
                  </div>

                  <div className="d-flex justify-content-center">
                     <button className="btn cloud-btn px-md rounded-0 mr-3" onClick={handleClickClose}>Cancel</button>
                     <button className="btn btn-black px-md rounded-0" onClick={handleSubmit}>Apply</button>
                  </div>
               </div>
               <div className={clsx("recommend-form", status === "success" ? "" : "d-none")}>
                  <div className="d-flex justify-content-center">
                     <button className="btn btn-black px-md rounded-0 mr-3" onClick={handleClickProductRecommend}>Make first product recommendation</button>
                     <button className="btn cloud-btn px-md rounded-0" onClick={handleClickLater}>Later</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
