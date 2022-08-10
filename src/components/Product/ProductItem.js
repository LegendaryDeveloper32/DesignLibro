import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  IonRouterLink,
} from "@ionic/react";
import UserContext from "../../contexts/UserContext";
import productService from "../../services/product";
import UserDetailContext from "../../contexts/UserDetailContext";

const ProductItem = (props) => {
  console.log(" props.product ======= ", props.product)

  const [product, setProduct] = React.useState(props.product);
  React.useEffect(() => {
    setProduct(props.product);
  }, [props.product]);

  const { user } = React.useContext(UserContext);
  const { userDetail } = React.useContext(UserDetailContext);
  const productId = product.id;
  const brand = product.brand || "___";
  const voteCount = product.voteCount || "__";
  const thumbnail = product.thumbnail || "https://via.placeholder.com/180";
  const title = product.Title || product.title || "_____";
  const price = product.price || "___.__";
  const postedByName = product.postedBy ? product.postedBy.name : "_____";
  const comments = Array.isArray(product.comments) ? product.comments.map(comment => comment.postedBy.name) : [];

  const recommenderStr = comments.length > 0 ? comments.join(', ') : postedByName;
  const handleAddVote = () => {
    if (!user) {
      props.history.push("/login");
    } else {
      productService
        .addUpvote(user, userDetail, product.id)
        .then((newProduct) => setProduct(newProduct))
        .catch(() => props.history.push("/login"));
    }
  }
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="ps-item">
        <div className="ps-item-thumbnail">
          <div className="ps-badge d-none"><span>{brand}</span></div>
          <button className="ps-item-upvote" onClick={handleAddVote}>
            <img className="upvote-icon" src="/assets/images/icons-images/upvote.png" />
            <span>{voteCount}</span>
          </button>
          <img src={thumbnail} alt="product image" />
          <Link className="ps-item-overlay" to={`/product/${productId}`} />
        </div>
        <div className="ps-item-content">
          <div className="ps-item-detail">
            <Link className="ps-item-name" to={`/product/${productId}`} >{title}</Link>
            <p className="ps-item-price">{price}</p>
            <p className="ps-item-categories">Recommended by {recommenderStr}</p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default withRouter(ProductItem);