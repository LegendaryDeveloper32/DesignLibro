import React, { useRef } from 'react'
import useOnclickOutside from "react-cool-onclickoutside";
import { useHistory } from 'react-router';
import UserContext from '../../contexts/UserContext';
import useFormValidation from '../../hooks/useFormValidation';
import firebase from "../../firebase";
import { toast } from '../../utils/toast';
import validateMyRecommendation from '../Product/validateRecommendProduct';

const INITIAL_STATE = {
   recommendation: ""
};

export default function MyRecommendModal(props) {
   const { user } = React.useContext(UserContext);
   const { closeModal, product } = props;
   console.log(" product for recommendation ==> ", product)
   const history = useHistory();
   const [submitting, setSubmitting] = React.useState(false);
   const modalRef = useOnclickOutside(() => {
      closeModal();
   });
   const handleClickClose = () => closeModal();

   const { handleSubmit, handleChange, values } = useFormValidation(
      INITIAL_STATE,
      validateMyRecommendation,
      handleRecommend
   );
   async function handleRecommend() {
      try {
         if (!user) {
            history.push("/login");
            return;
         }

         setSubmitting(true);
         const { recommendation } = values;
         const productRef = firebase.db.collection("products").doc(product.id);
         console.log("  productDetail : ", product);
         const comments = product.comments && Array.isArray(product.comments) ? product.comments : [];
         const recommenders = product.recommenders && Array.isArray(product.recommenders) ? product.recommenders : [];
         
         console.log("  original comments : ", comments);
         const newComments = [
            ...comments,
            {
               created: Date.now(),
               postedBy: {
                  name: user.displayName,
                  id: user.uid
               },
               text: recommendation
            }
         ];
         const newRecommenders = [...recommenders, user.uid];
         console.log("  newComments : ", newComments);

         await productRef.update({
            comments: newComments,
            votedByInfluencer: true,
            recommenders: newRecommenders
         });
         closeModal();
      } catch (e) {
         console.error(e);
         toast(e.message);
         setSubmitting(false);
      }
   }
   return (
      <div className="bg-modal-gray">
         <div className="product-recommend-modal" ref={modalRef}>
            <button className="toggle-btn" onClick={handleClickClose}>
               <img src="/assets/images/close.png" alt="..." />
            </button>
            <h3 className="section-title text-center">My Recommendation</h3>
            <div className="d-flex justify-content-center">
               <div className="recommend-form">
                  <div className="form-group mb-4">
                     <label htmlFor="yourRecommendation">Recommendation</label>
                     <textarea type="text"
                        className="form-control"
                        id="yourRecommendation"
                        name="recommendation"
                        rows="3"
                        placeholder=""
                        value={values.recommendation}
                        onChange={handleChange} />
                  </div>
                  <div className="d-flex justify-content-center">
                     <button
                        type="submit"
                        className="btn btn-black px-md rounded-0"
                        disabled={submitting}
                        onClick={handleSubmit}>Submit</button>
                  </div>
               </div>
            </div>
         </div>
      </div >
   )
}
