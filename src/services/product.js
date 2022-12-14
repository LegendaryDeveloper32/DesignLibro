import UserDetailContext from "../contexts/UserDetailContext";
import firebase from "../firebase";

function addUpvote(user, userDetail, productId) {
  if (!user) return Promise.reject();
  const productRef = firebase.db.collection("products").doc(productId);

  return productRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const previousVotes = data.votes;
      // const vote = {
      //   votedBy: { id: user.uid, name: user.displayName }
      // };
      const votedByInfluencer = userDetail ? userDetail.isInfluencer : false;
      const vote = { id: user.uid };
      const updatedVotes = [...previousVotes, vote];
      const voteCount = updatedVotes.length;
      productRef.update({ votes: updatedVotes, voteCount });

      return {
        id: productId,
        ...data,
        votes: updatedVotes,
        voteCount: voteCount,
      };
    }
  });
}

export default {
  addUpvote,
};