import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.app = app;
    this.storage = app.storage();
    this.auth = app.auth();
    this.db = app.firestore();
  }

  async register(displayName, userName, email, password) {
    const newUser = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    await this.db.collection("userProfiles").add({
      uid: newUser.user.uid,
      isInfluencer: false,
      invitationCode: 'DL1234',
      photoURL: "",
      displayName: displayName,
      userName: userName,
      email: email,
      instagram: "",
      facebook: "",
      twitter: "",
      biography: "",
      followers: [],
      followings: []
    });
    
    return newUser.user.updateProfile({
      displayName: displayName,
    });
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  resetPassword(email) {
    return this.auth.sendPasswordResetEmail(email);
  }

  googleLogin() {
    const googleProvider = new app.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(googleProvider);
  }
  facebookLogin() {
    const facebookProvider = new app.auth.FacebookAuthProvider();
    return this.auth.signInWithPopup(facebookProvider);
  }
  twitterLogin() {
    const twitterProvider = new app.auth.TwitterAuthProvider();
    return this.auth.signInWithPopup(twitterProvider);
  }
  instagramLogin() {
    // Open the popup that will start the auth flow.
    window.open('popup.html', 'name', 'height=585,width=400');
  }
}

const firebase = new Firebase();
export default firebase;