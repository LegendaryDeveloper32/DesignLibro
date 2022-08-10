import { IonRouterLink } from '@ionic/react'
import React from 'react'
import UserContext from '../../contexts/UserContext';
import productService from "../../services/product";
import colorString from "color-string";
import stringToHexColor from "string-to-hex-color";
import _ from "lodash";
import UserDetailContext from '../../contexts/UserDetailContext';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { INIT_URL } from '../../constants/ActionTypes';
import { Link } from 'react-router-dom';

export default function ProductOverview(props) {
  const history = useHistory();
  const { product, setProduct } = props;
  const { user } = React.useContext(UserContext);
  const { userDetail } = React.useContext(UserDetailContext);
  const dispatch = useDispatch();
  function handleAddVote() {
    if (!user) {
      console.log("history.location.pathname : ", history.location.pathname)
      dispatch({ type: INIT_URL, payload: history.location.pathname });
      history.push("/register");
    } else {
      productService
        .addUpvote(user, userDetail, product.id)
        .then((newProduct) => setProduct(newProduct))
        .catch(() => history.push("/login"));
    }
  }
  const title = product.Title || product.title || "_____";
  const price = product.price || "$ ___.__";
  const voteCount = product.voteCount || "__";
  return (
    <div className="row no-gutters mb-5">
      <aside className="col-md-7">
        <article className="gallery-wrap">
          <div className="row no-gutters">
            <aside className="col-3">
              <div className="thumbs-wrap flex-column">
                {Array.isArray(product.photos) && product.photos.length > 0 ? _.chunk(product.photos, 3)[0].map((photo, index) => (
                  <a key={index} href={photo} target="_blank" className="item-thumb"> <img src={photo} /></a>
                )) : null}
              </div>
            </aside>
            <div className="col-9">
              <div className="img-big-wrap">
                <a href={_.head(product.photos)} target="_blank"><img src={_.head(product.photos) || "https://via.placeholder.com/180"} style={{}} /></a>
              </div>
            </div>
          </div>
        </article>
      </aside>
      <main className="col-md-5">
        <article className="content-body">
          <div className="position-relative mb-4">
            <div className="d-flex mb-3">
              <div className="title">{title}</div>
              <button className="ps-item-upvote-full" onClick={handleAddVote}>
                <img className="upvote-icon mr-2" src="/assets/images/icons-images/upvote.png" />
                <span><b>Upvote</b> ({product.voteCount})</span>
              </button>
            </div>
            <div className="price">{price}</div>
          </div>
          <div className="form-group">
            <label>Available color</label>
            <div className="color-list-wrapper mb-4">
              {
                product.color && Array.isArray(product.color) ? product.color.map((color, index) => {
                  return <span key={index} style={{ backgroundColor: stringToHexColor(color)[0] }} />
                }) : null
              }
            </div>
            <label>Description</label>
            <p>{product.description}</p>
            <ul className="list-check cols-one mb-5">
              {
                product.specification && Array.isArray(product.specification) ? product.specification.map((spec, index) => (
                  <li key={index} className="mb-3">{spec}</li>
                )) : null
              }
            </ul>
            {
              product.url ?
                <a href={product.url} target="_blank" className="btn btn-black px-lg py-2 rounded-0">Go to shop</a>
                : <Link to="/home" className="btn btn-black px-lg py-2 rounded-0">Go to shop</Link>
            }
          </div>
        </article>
      </main>
    </div>
  )
}
