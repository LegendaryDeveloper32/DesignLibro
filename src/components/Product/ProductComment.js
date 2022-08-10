import React from "react";
import {
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import UserContext from "../../contexts/UserContext";
import CommentModal from "./CommentModal";
import firebase from "../../firebase";
import { withRouter } from "react-router";
import productService from '../../services/product';
import UserDetailContext from "../../contexts/UserDetailContext";

const ProductComment = (props) => {
  const { user } = React.useContext(UserContext);
  const { userDetail } = React.useContext(UserDetailContext);
  const [showModal, setShowModal] = React.useState(false);

  const { product, comment, setProduct } = props;
  const postedByAuthUser = user && user.uid === comment.postedBy.id;
  const commentVoteCount = comment.votes ? comment.votes : 0;

  // function handleEditComment(commentText) {
  //   const productRef = firebase.db.collection("products").doc(product.id);
  //   productRef.get().then((doc) => {
  //     if (doc.exists) {
  //       const previousComments = doc.data().comments;
  //       const newComment = {
  //         postedBy: { id: user.uid, name: user.displayName },
  //         created: Date.now(),
  //         text: commentText,
  //       };
  //       const updatedComments = previousComments.map((item) =>
  //         item.created === comment.created ? newComment : item
  //       );
  //       productRef.update({ comments: updatedComments });
  //     }
  //   });
  //   setShowModal(false);
  // }

  // function handleDeleteComment() {
  //   const productRef = firebase.db.collection("products").doc(product.id);
  //   productRef.get().then((doc) => {
  //     if (doc.exists) {
  //       const previousComments = doc.data().comments;
  //       const updatedComments = previousComments.filter(
  //         (item) => item.created !== comment.created
  //       );
  //       productRef.update({ comments: updatedComments });
  //     }
  //   });
  // }
  // const handleAddVote = () => {
  //   if (!user) {
  //     props.history.push("/login");
  //   } else {
  //     productService
  //       .addUpvote(user, userDetail, product.id)
  //       .then((newProduct) => setProduct(newProduct))
  //       .catch(() => props.history.push("/login"));
  //   }
  // }
  
  const handleAddVoteComment = async () => {
    if (!user) {
      props.history.push("/login");
    } else {
      const productRef = firebase.db.collection("products").doc(product.id);
      let list = [];
      const data = await productRef.get();
      const { comments } = data.data();
      list = [...comments];
      const commentIndex = props.index;
      const newList = list.map((item, index) => {
        if (commentIndex == index) {
          const votes = item.votes ? item.votes : 0;
          return {
            ...item,
            votes: votes + 1
          };
        } else return item;
      });
      productRef.update({ comments: newList })
    }
  }
  return (
    <div className="recommend-wrapper">
      <img className="avartar" src="/assets/images/icons-images/user.png" />
      <div className="position-relative">
        <button className="ps-item-upvote" onClick={handleAddVoteComment}>
          <img className="upvote-icon" src="/assets/images/icons-images/upvote.png" />
          <span>{commentVoteCount}</span>
        </button>
        <label>{comment.postedBy.name}</label>
        <div className="date">{formatDistanceToNow(comment.created)}</div>
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

export default withRouter(ProductComment);