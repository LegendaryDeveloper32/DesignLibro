import React from 'react'
import UserContext from '../../contexts/UserContext';
import ProductItem from '../Product/ProductItem';
import firebase from "../../firebase";
import ToggleBtn from '../Shared/ToggleBtn';
import clsx from 'clsx';
import { IonRouterLink } from '@ionic/react';
import { useHistory } from 'react-router';
import { toast } from '../../utils/toast';

export default function DesignerDetail(props) {
  console.log("props.designerData ===", props.designerData)
  const { uid, displayName, userName, photoURL, instagram, facebook, twitter, biography, followers } = props.designerData;
  const { user } = React.useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [count, setCount] = React.useState(1);
  const [products, setProducts] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);

  let photo = photoURL ? photoURL : "/assets/images/person.png";
  let designerDisplayName = displayName ? displayName : "___";

  React.useEffect(() => {
    getMyRecommendationProducts();
    // eslint-disable-next-line
  }, [count, user]);

  function getMyRecommendationProducts() {
    return firebase.db
      .collection("products")
      // .where('postedBy.id', "==", uid)
      .where('recommenders', 'array-contains', uid)
      .get()
      .then(handleSnapshot);
  }
  function handleSnapshot(snapshot) {
    const products = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setProducts(products);
  }

  const handleClickFollow = async () => {
    try {
      if (!user) {
        history.push("/login");
        return;
      }
      setSubmitting(true);
      const querySnapshot = await firebase.db
        .collection("userProfiles")
        .where('uid', '==', uid)
        .get();

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDetail = userDoc.data();
        const newFollowersData = userDetail.followers ?
          userDetail.followers.includes(user.uid) ? userDetail.followers : [...userDetail.followers, user.uid]
          : [user.uid];
        console.log(" newFollowersData === ", newFollowersData)
        await userDoc.ref.update({
          followers: newFollowersData
        });

        /**update user's followings*/
        const querySnapshot2 = await firebase.db
          .collection("userProfiles")
          .where('uid', '==', user.uid)
          .get();
        if (!querySnapshot2.empty) {
          const userDoc = querySnapshot2.docs[0];
          const userDetail = userDoc.data();
          const newFolloweringsData = userDetail.followings ?
            userDetail.followings.includes(user.uid) ? userDetail.followings : [...userDetail.followings, uid]
            : [user.uid];
          console.log(" newFolloweringsData === ", newFolloweringsData)
          await userDoc.ref.update({
            followings: newFolloweringsData
          });
        } else console.log('No such document!');
      } else console.log('No such document!');
    } catch (e) {
      console.error(e);
      toast(e.message);
      setSubmitting(false);
    }
  }
  const followersCount = followers && Array.isArray(followers) ? followers.length : 0;
  return (
    <div className="round-section mb-3">
      <ToggleBtn open={open} setOpen={(val) => setOpen(val)} />
      {
        open ?
          <React.Fragment>
            <div className="row no-gutters p-5">
              <div className="col-3">
                <div className="d-flex w-100">
                  <img src={photo} className="designer-image m-auto" />
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <div className="d-flex w-50" style={{ justifyContent: "space-evenly" }}>
                    <a className="social-icon-btn" target="_blank" href={facebook ? facebook : "https://facebook.com"} > <img src="/assets/images/icons-images/facebook-icon.png" /></a>
                    <a className="social-icon-btn" target="_blank" href={instagram ? instagram : "https://instagram.com"} > <img src="/assets/images/icons-images/instagram-icon.png" /></a>
                    <a className="social-icon-btn" target="_blank" href={twitter ? twitter : "https://twitter.com"} > <img src="/assets/images/icons-images/twitter-icon.png" /></a>
                  </div>
                </div>
              </div>
              <div className="col-9 px-4">
                <div className="d-flex">
                  <label className="mb-0">{designerDisplayName}</label>
                  <span className="follower-label ml-auto">{followersCount} Followers</span>
                </div>
                <div className="designer-label">Top Designer</div>
                <p className="pr-3 mt-3">
                  {biography ? biography : "No biography information..."}</p>
                <div className="d-flex">
                  <button className="follow-btn ml-auto" onClick={handleClickFollow}>Follow</button>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="section-title">Recommended by {designerDisplayName}</h3>
              <div className="row">
                {products.map((product, index) => <ProductItem key={index} product={product} />)}
              </div>
              <div className="row no-gutters mb-5">
                <button className="btn btn-black px-md rounded-0 ml-auto" onClick={() => setCount(count + 1)}>See more</button>
              </div>
            </div>
          </React.Fragment>
          : <React.Fragment>
            <div className="row no-gutters px-5 py-4">
              <div className="col-12">
                <label className="mb-0">{designerDisplayName}</label>
              </div>
            </div>
          </React.Fragment>
      }
    </div >
  )
}
