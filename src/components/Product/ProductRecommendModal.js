import React, { useRef } from 'react'
import useOnclickOutside from "react-cool-onclickoutside";
import { useHistory } from 'react-router';
import UserContext from '../../contexts/UserContext';
import useFormValidation from '../../hooks/useFormValidation';
import Upload from '../Form/Upload';
import validateRecommendProduct from '../Product/validateRecommendProduct';
import firebase from "../../firebase";
import { toast } from '../../utils/toast';
import clsx from 'clsx';

const INITIAL_STATE = {
   title: "",
   url: "",
   price: "",
   brand: "",
   designer: "",
   recommendation: ""
};

export default function ProductRecommendModal(props) {
   const { user } = React.useContext(UserContext);
   const { closeModal } = props;
   const history = useHistory();
   const [submitting, setSubmitting] = React.useState(false);
   const [thumb, setThumb] = React.useState([]);
   const [photos, setPhotos] = React.useState([]);
   const modalRef = useOnclickOutside(() => {
      closeModal();
   });
   const handleClickClose = () => closeModal();

   const { handleSubmit, handleChange, values } = useFormValidation(
      INITIAL_STATE,
      validateRecommendProduct,
      handleRecommend
   );
   async function handleRecommend() {
      try {
         if (!user) {
            history.push("/login");
            return;
         }

         setSubmitting(true);

         const {
            title,
            url,
            price,
            brand,
            designer,
            recommendation
         } = values;
         const id = firebase.db.collection("products").doc().id;

         await Promise.all([
            ...thumb.map((f, index) =>
               firebase.storage
                  .ref()
                  .child(`products/${id}_thumb_${index}.jpg`)
                  .put(f)
            ),
            ...photos.map((f, index) =>
               firebase.storage
                  .ref()
                  .child(`products/${id}_photo_${index}.jpg`)
                  .put(f)
            ),
         ]);

         const productPhotos = await Promise.all(
            photos.map((f, index) =>
               firebase.storage
                  .ref()
                  .child(`products/${id}_photo_${index}.jpg`)
                  .getDownloadURL()
            )
         );

         const productThumbs = await Promise.all(
            thumb.map((f, index) =>
               firebase.storage
                  .ref()
                  .child(`products/${id}_thumb_${index}.jpg`)
                  .getDownloadURL()
            )
         );

         const newProduct = {
            title,
            url,
            price,
            brand,
            description: "",
            specification: designer ? [`Designed by ${designer}`] : [],
            postedBy: {
               id: user.uid,
               name: user.displayName,
            },
            thumbnail: productThumbs[0] || null,
            photos: productPhotos,
            voteCount: 1,
            comments: [{
               created: Date.now(),
               postedBy: {
                  name: user.displayName,
                  id: user.uid
               },
               text: recommendation
            }],
            voteCount: 1,
            votes: [
               // {
               //    votedBy: { id: user.uid, name: user.displayName },
               // },
               { id: user.uid },
            ],
            votedByInfluencer: true,
            recommenders: [user.uid],
            created: Date.now(),
         };
         setThumb([]);
         setPhotos([]);
         await firebase.db.collection("products").doc(id).set(newProduct);
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
            <h3 className="section-title text-center">Product Recommend</h3>
            <div className="d-flex justify-content-center">
               <div className="recommend-form">
                  <div className="form-group mb-1">
                     <label htmlFor="title">Product Title</label>
                     <input type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        placeholder=""
                        value={values.title}
                        onChange={handleChange} />
                  </div>
                  <div className="form-group mb-1">
                     <label htmlFor="url">URL</label>
                     <input type="text"
                        className="form-control"
                        id="url"
                        name="url"
                        placeholder=""
                        value={values.url}
                        onChange={handleChange} />
                  </div>
                  <div className="form-group mb-1">
                     <label htmlFor="price">Price</label>
                     <input type="text"
                        className="form-control"
                        id="price"
                        name="price"
                        placeholder=""
                        value={values.price}
                        onChange={handleChange} />
                  </div>
                  <div className="form-group mb-1">
                     <label htmlFor="brand">Brand</label>
                     <input type="text"
                        className="form-control"
                        id="brand"
                        name="brand"
                        placeholder=""
                        value={values.brand}
                        onChange={handleChange} />
                  </div>
                  <div className="form-group mb-1">
                     <label htmlFor="designer">Designer</label>
                     <input type="text"
                        className="form-control"
                        id="designer"
                        name="designer"
                        placeholder=""
                        value={values.designer}
                        onChange={handleChange} />
                  </div>
                  <div className="form-group mb-4">
                     <label htmlFor="yourRecommendation">Your Recommendation</label>
                     <input type="text"
                        className="form-control"
                        id="yourRecommendation"
                        name="recommendation"
                        placeholder=""
                        value={values.recommendation}
                        onChange={handleChange} />
                  </div>
                  <div className="d-flex justify-content-around mb-3">
                     <Upload
                        onChange={setThumb}
                        placeholder="Select main photo"
                        files={thumb}
                        multiple={false} />
                     <Upload
                        onChange={setPhotos}
                        placeholder="Select additional photos"
                        files={photos}
                        multiple={true} />
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
