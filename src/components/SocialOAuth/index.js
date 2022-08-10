import React from 'react'
import { withRouter } from 'react-router';
import firebase from "../../firebase";
import { toast } from '../../utils/toast';

function SocialOAuth(props) {

   const handleGoogleLogin = async () => {
      try {
         const newUser = await firebase.googleLogin();
         // await firebase.db.collection("userProfiles").add({
         //    uid: newUser.user.uid,
         //    isInfluencer: false,
         //    invitationCode: '123456',
         // });
         toast("You have logged in successfully!");
         props.history.push("/profile");
      } catch (err) {
         console.error("Authentication Error", err);
         toast(err.message);
      }
   }
   const handleTwitterLogin = async () => {
      try {
         await firebase.twitterLogin();
         toast("You have logged in successfully!");
         props.history.push("/profile");
      } catch (err) {
         console.error("Authentication Error", err);
         toast(err.message);
      }
   }
   const handleFacebookLogin = async () => {
      try {
         await firebase.facebookLogin();
         toast("You have logged in successfully!");
         props.history.push("/profile");
      } catch (err) {
         console.error("Authentication Error", err);
         toast(err.message);
      }
   }
   const handleInstagramLogin = async () => {
      try {
         firebase.instagramLogin();
         toast("You have logged in successfully!");
         props.history.push("/profile");
      } catch (err) {
         console.error("Authentication Error", err);
         toast(err.message);
      }
   }
   return (
      <div className="d-flex justify-content-between mb-4">
         <button className="btn btn-primary"
            onClick={handleGoogleLogin}
         >
            <img className="mr-2" src="/assets/images/google-icon.png" alt="google icon" /> Continue with Google
            </button>
         <button className="btn btn-gray"
            onClick={handleTwitterLogin}
         >
            <img src="/assets/images/twitter-icon.png" alt="twitter icon" />
         </button>
         <button className="btn btn-gray"
            onClick={handleFacebookLogin}
         >
            <img src="/assets/images/facebook-icon.png" alt="facebook icon" />
         </button>
         <button className="btn btn-gray"
            onClick={handleInstagramLogin}
         >
            <img src="/assets/images/instagram-icon.png" alt="instagram icon" />
         </button>
      </div>
   )
}

export default withRouter(SocialOAuth);