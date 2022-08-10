import React, { useState } from 'react'
import { IonContent, IonPage } from '@ionic/react'
import Footer from '../components/Header/Footer'
import Navbar from '../components/Header/Navbar'
import UserContext from '../contexts/UserContext'
import firebase from "../firebase";
import ProductItem from "../components/Product/ProductItem";
import ProductRecommendModal from '../components/Product/ProductRecommendModal'
import useFormValidation from '../hooks/useFormValidation'
import { toast } from '../utils/toast'
import validateEditProfile from '../components/Auth/validateEditProfile'
import { withRouter } from 'react-router'
import Upload from '../components/Form/Upload'
import UserDetailContext from '../contexts/UserDetailContext'

function EditProfile(props) {
   const { user, setUser } = React.useContext(UserContext);
   const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
   const [thumb, setThumb] = React.useState([]);

   React.useEffect(() => {
      if (userDetail) {
         const profileValues = {
            userName: userDetail.userName,
            displayName: userDetail.displayName,
            email: userDetail.email,
            password: "",

            instagram: userDetail.instagram,
            facebook: userDetail.facebook,
            twitter: userDetail.twitter,
            biography: userDetail.biography,
         };
         setValues(profileValues);
      }
   }, [userDetail]);

   const INITIAL_STATE = {
      userName: "",
      displayName: "",
      email: "",
      password: "",

      instagram: "",
      facebook: "",
      twitter: "",
      biography: "",
   };

   const {
      handleSubmit,
      handleChange,
      setValues,
      values,
      isSubmitting,
   } = useFormValidation(INITIAL_STATE, validateEditProfile, updateUserInfo);

   console.log("values ===", values)
   const [busy, setBusy] = React.useState(false);

   function updateUserInfo() {
      setBusy(true);
      const { userName, displayName, email, password, instagram, facebook, twitter, biography } = values;

      firebase.db
         .collection("userProfiles")
         .where('uid', '==', user.uid)
         .get()
         .then(async querySnapshot => {
            // await reauthenticate(email, currentPassword);
            if (!querySnapshot.empty) {
               const userDoc = querySnapshot.docs[0];
               await userDoc.ref.update({ userName, displayName, instagram, facebook, twitter, biography });
               await user.updateEmail(email);
               await user.updateProfile({ displayName });
               if (password) await user.updatePassword(password);
               // setUser(user);
               setUserDetail({ ...userDetail, userName, instagram, facebook, twitter, biography })
               props.history.push('/profile');
            } else {
               console.log('No such document!');
            }

            setValues({
               userName: userName,
               email: email,
               password: "",
               instagram, facebook, twitter, biography
            });
            toast("You have updated your profile successfully.");
            props.history.push("/profile");
         })
         .catch(err => {
            console.error("Profile Update Error", err);
            toast(err.message);
         })
      setBusy(false);
   }
   async function reauthenticate(email, password) {
      const credential = firebase.app.auth.EmailAuthProvider.credential(
         email,
         password
      );
      try {
         await user.reauthenticateWithCredential(credential);
         console.log("Reauthentication Successful");
      } catch (err) {
         console.error("Profile Update Error", err);
         toast(err.message);
      }
   }

   const [count, setCount] = React.useState(1);
   const [products, setProducts] = React.useState([]);
   const [isModalOpen, setIsModalOpen] = React.useState(false);
   const [isEditable, setIsEditable] = React.useState(false);

   React.useEffect(() => {
      getNewProducts();
      // eslint-disable-next-line
   }, [count]);
   function getNewProducts() {
      return firebase.db
         .collection("products")
         .orderBy("created", "desc")
         .limit(4 * count)
         .get()
         .then(handleSnapshot);
   }
   function handleSnapshot(snapshot) {
      const products = snapshot.docs.map((doc) => {
         return { id: doc.id, ...doc.data() };
      });
      setProducts(products);
   }

   React.useEffect(() => {
      if (thumb.length > 0) {
         handleUploadPhoto()
      }
   }, [thumb]);

   const handleUploadPhoto = () => {
      console.log("thumb :: ", thumb)
      const id = firebase.db.collection("userProfiles").doc().id;
      Promise.all([
         ...thumb.map((f, index) =>
            firebase.storage
               .ref()
               .child(`userProfiles/${id}_photo_${index}.jpg`)
               .put(f)
         )
      ]).then(async () => {
         const photoThumbs = await Promise.all(
            thumb.map((f, index) =>
               firebase.storage
                  .ref()
                  .child(`userProfiles/${id}_photo_${index}.jpg`)
                  .getDownloadURL()
            )
         );
         setThumb([]);
         console.log("photoThumbs: ", photoThumbs)

         await user.updateProfile({
            photoURL: photoThumbs[0] || null
         });
         props.history.push('/edit-profile');
      })
   };

   const photoURL = user && user.photoURL ? user.photoURL : "/assets/images/person.png";
   return (
      <IonPage>
         <IonContent fullscreen>
            <Navbar title="DesignLibro" />
            <div className="content">
               <div className="">
                  <div className="row no-gutters px-5">
                     <div className="col-lg-4 col-md-6">
                        <div className="d-flex w-100">
                           <img src={photoURL} className="designer-image m-auto" />
                        </div>
                        <div className="d-flex justify-content-center my-3">
                           <Upload
                              className="d-flex social-icon-btn bg-white"
                              onChange={setThumb}
                              placeholder="Select main photo"
                              files={thumb}
                              multiple={false}>
                              <img className="my-auto mr-2" src="/assets/images/camera.png" />
                              <span className="my-auto">Edit profile photo</span>
                           </Upload>
                        </div>
                     </div>
                     <div className="col-lg-4 col-md-6">
                        <div className="d-flex justify-content-center">
                           <div className="w-100 mb-4">
                              <label className="subTitle mb-3">Profile Setting</label>
                              <div className="form-group mb-1">
                                 <label htmlFor="userName">Username</label>
                                 <input type="text"
                                    className="form-control"
                                    id="userName"
                                    name="userName"
                                    value={values.userName}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                    required />
                              </div>
                              <div className="form-group mb-1">
                                 <label htmlFor="displayName">Display Name</label>
                                 <input type="text"
                                    className="form-control"
                                    id="displayName"
                                    name="displayName"
                                    value={values.displayName}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                    required />
                              </div>
                              <div className="form-group mb-1">
                                 <label htmlFor="email">Email Address</label>
                                 <input type="text"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                    required />
                              </div>
                              <div className="form-group mb-1">
                                 <label htmlFor="password">New Password</label>
                                 <input type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    disabled={!isEditable} />
                              </div>
                              <div className="form-group mb-1">
                                 <label htmlFor="instagram">Instagram</label>
                                 <input type="text"
                                    className="form-control"
                                    id="instagram"
                                    name="instagram"
                                    value={values.instagram}
                                    onChange={handleChange}
                                    disabled={!isEditable} />
                              </div>
                              <div className="form-group mb-1">
                                 <label htmlFor="facebook">Facebook</label>
                                 <input type="text"
                                    className="form-control"
                                    id="facebook"
                                    name="facebook"
                                    value={values.facebook}
                                    onChange={handleChange}
                                    disabled={!isEditable} />
                              </div>
                              <div className="form-group mb-1">
                                 <label htmlFor="twitter">Twitter</label>
                                 <input type="text"
                                    className="form-control"
                                    id="twitter"
                                    name="twitter"
                                    value={values.twitter}
                                    onChange={handleChange}
                                    disabled={!isEditable} />
                              </div>
                              <div className="form-group mb-1">
                                 <label htmlFor="biography">Biography</label>
                                 <textarea type="text"
                                    rows="3"
                                    className="form-control"
                                    id="biography"
                                    name="biography"
                                    value={values.biography}
                                    onChange={handleChange}
                                    disabled={!isEditable} />
                              </div>
                           </div>
                        </div>
                        <div className="d-flex justify-content-center">
                           {
                              isEditable ?
                                 <>
                                    <button className="btn btn-black px-md rounded-0 ml-3" onClick={handleSubmit} disabled={busy}>Save</button>
                                    <button className="btn cloud-btn px-md rounded-0 ml-3" onClick={() => setIsEditable(false)} disabled={busy}>Cancel</button>
                                 </>
                                 : <button className="btn cloud-btn px-md rounded-0" onClick={() => setIsEditable(true)} disabled={busy}>Edit Profile</button>
                           }

                        </div>
                     </div>

                  </div>
               </div>
            </div>
            <Footer />
            {isModalOpen && <ProductRecommendModal setIsModalOpen={(val) => setIsModalOpen(val)} />}
         </IonContent>
      </IonPage>
   )
}

export default withRouter(EditProfile);
