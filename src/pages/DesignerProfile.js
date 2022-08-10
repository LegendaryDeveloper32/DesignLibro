import React from 'react'
import { IonContent, IonPage, IonRouterLink } from '@ionic/react'
import Footer from '../components/Header/Footer'
import Navbar from '../components/Header/Navbar'
import UserContext from '../contexts/UserContext'
import firebase from "../firebase";
import ProductItem from "../components/Product/ProductItem";
import ProductRecommendModal from '../components/Product/ProductRecommendModal'
import { useHistory } from 'react-router'
import UserDetailContext from '../contexts/UserDetailContext'
import { Link } from 'react-router-dom'

function DesignerProfile(props) {
   const { user, setUser } = React.useContext(UserContext);
   const { userDetail } = React.useContext(UserDetailContext);
   const history = useHistory();
   const [count, setCount] = React.useState(1);
   const [countP, setCountP] = React.useState(1);
   const [countD, setCountD] = React.useState(1);
   const [products, setProducts] = React.useState([]);
   const [isModalOpen, setIsModalOpen] = React.useState(false);

   const [upvotedProducts, setUpvotedProducts] = React.useState([]);
   const [followingDesigners, setFollowingDesigners] = React.useState([]);

   React.useEffect(() => {
      setIsModalOpen(props.isRecommendModalOpen);
   }, [props]);

   React.useEffect(() => {
      if (user) getMyRecommendationProducts();
      // eslint-disable-next-line
   }, [count, user]);
   React.useEffect(() => {
      if (user) getMyUpvotedProducts();
      // eslint-disable-next-line
   }, [countP, user]);
   React.useEffect(() => {
      if (user) getFollowingDesigners();
      // eslint-disable-next-line
   }, [countD, user]);

   function getMyRecommendationProducts() {
      if (!user) {
         history.push("/login");
         return;
      }
      return firebase.db
         .collection("products")
         .where('recommenders', 'array-contains', user.uid)
         .get()
         .then(handleSnapshot);
   }

   function getMyUpvotedProducts() {
      if (!user) {
         history.push("/login");
         return;
      }
      return firebase.db
         .collection("products")
         .where('votes', "array-contains", { id: user.uid })
         .limit(4 * countP)
         .get()
         .then(handleSnapshotProducts);
   }
   function getFollowingDesigners() {
      if (!user) {
         history.push("/login");
         return;
      }
      return firebase.db
         .collection("userProfiles")
         .where('isInfluencer', '==', true)
         .where('followers', 'array-contains', user.uid)
         .limit(4 * countD)
         .get()
         .then(handleSnapshotDesingers);
   }
   function handleSnapshot(snapshot) {
      console.log("snapshot.docs: ", snapshot.docs)
      const products = snapshot.docs.map((doc) => {
         return { id: doc.id, ...doc.data() };
      });
      setProducts(products);
   }
   function handleSnapshotProducts(snapshot) {
      const products = snapshot.docs.map((doc) => {
         return { id: doc.id, ...doc.data() };
      });
      setUpvotedProducts(products);
   }
   function handleSnapshotDesingers(snapshot) {
      const designerList = snapshot.docs.map((doc) => {
         return { id: doc.id, ...doc.data() };
      });
      setFollowingDesigners(designerList);
   }
   console.log("userDetail ==", userDetail)
   const photoURL = user && user.photoURL ? user.photoURL : "/assets/images/person.png";
   const displayName = user && user.displayName ? user.displayName : "___";
   const userName = userDetail && userDetail.userName ? "Top Designer" : "Top Designer";
   const biography = userDetail && userDetail.biography ? userDetail.biography : "Please edit profile to write your own Bio";
   const followerCount = userDetail && userDetail.followers ? userDetail.followers.length : 0;
   const followingCount = userDetail && userDetail.followings ? userDetail.followings.length : 0;
   return (
      <IonPage>
         <IonContent fullscreen>
            <Navbar title="DesignLibro" />
            <div className="content">
               <div className="round-section">
                  <div className="row no-gutters align-items-center p-5">
                     <div className="col-3">
                        <div className="d-flex w-100">
                           <img src={photoURL} className="designer-image m-auto" />
                        </div>
                        {/* <div className="d-flex justify-content-center mt-3">
                           <div className="d-flex w-50" style={{ justifyContent: "space-evenly" }}>
                              <a className="social-icon-btn" href="https://facebook.com"><img src="/assets/images/icons-images/facebook-icon.png" /></a>
                              <a className="social-icon-btn" href="https://instagram.com"><img src="/assets/images/icons-images/instagram-icon.png" /></a>
                              <a className="social-icon-btn" href="https://twitter.com"><img src="/assets/images/icons-images/twitter-icon.png" /></a>
                           </div>
                        </div> */}
                     </div>
                     <div className="col-9 px-4">
                        <div className="d-flex">
                           <label className="mb-0">{displayName}</label>
                           <span className="follower-label ml-auto">{followingCount} Followings</span>
                           <span className="follower-label pl-4">{followerCount} Followers</span>
                        </div>
                        <div className="designer-label">{userName}</div>
                        <p className="pr-3 mt-3">{biography}</p>
                        <div className="d-flex">
                           <button className="btn btn-black px-md rounded-0 ml-auto" onClick={() => setIsModalOpen(true)}>Recommend a product</button>
                           <Link className="btn cloud-btn px-sm rounded-0 ml-3" to="/edit-profile">Edit profile</Link>
                        </div>
                     </div>
                  </div>
                  <div className="p-5">
                     <h3 className="section-title">My Product Recommendations</h3>
                     <div className="row">
                        {products.map((product, index) => <ProductItem key={index} product={product} />)}
                     </div>
                     <div className="row no-gutters mb-5">
                        <button className="btn btn-black px-md rounded-0 ml-auto" onClick={() => setCount(count + 1)}>See more</button>
                     </div>
                  </div>

                  <div className="p-5">
                     <h3 className="section-title">Products I Upvoted</h3>
                     <div className="row">
                        {upvotedProducts.map((product, index) => <ProductItem key={index} product={product} />)}
                     </div>
                     <div className="row no-gutters mb-5">
                        <button className="btn btn-black px-md rounded-0 ml-auto" onClick={() => setCountP(countP + 1)}>See more</button>
                     </div>
                  </div>

                  <div className="p-5">
                     <h3 className="section-title">The Designers I follow</h3>
                     <div className="row">
                        {followingDesigners.map((designer, index) => {
                           console.log(" designer ===", designer)
                           const photoURL = designer.photoURL ? designer.photoURL : "https://via.placeholder.com/180";
                           const displayName = designer.displayName ? designer.displayName : "___ ___";
                           const userName = designer.userName ? designer.userName : "____";

                           return (
                              <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                                 <div className="ps-item">
                                    <div className="ps-item-thumbnail">
                                       <img src={photoURL} alt="product image" />
                                    </div>
                                    <div className="ps-item-content">
                                       <div className="ps-item-detail">
                                          <strong>{displayName}</strong>
                                          <p className="ps-item-price">{userName}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                     <div className="row no-gutters mb-5">
                        <button className="btn btn-black px-md rounded-0 ml-auto" onClick={() => setCountD(countD + 1)}>See more</button>
                     </div>
                  </div>
               </div>
            </div>
            <Footer />
            {
               isModalOpen &&
               <ProductRecommendModal closeModal={() => setIsModalOpen(false)} />
            }
         </IonContent>
      </IonPage>
   )
}

export default DesignerProfile
