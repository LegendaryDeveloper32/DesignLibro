import React from "react";
import UserContext from "../contexts/UserContext";
import firebase from "../firebase";

function useDetailAuth(props) {
  const { user } = props;
  console.log("props.user =========== ", props.user)
  const [authUserDetail, setAuthUserDetail] = React.useState(null);

  React.useEffect(() => {
    if (user) firebase.db
      .collection("userProfiles")
      .where('uid', '==', user.uid)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const userDetail = querySnapshot.docs[0].data();
          setAuthUserDetail(userDetail);
        } else {
          console.log('No such User document!');
        }
      });
  }, [user]);

  return [authUserDetail, setAuthUserDetail];
}

export default useDetailAuth;