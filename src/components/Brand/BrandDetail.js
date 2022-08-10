import React from 'react'
import UserContext from '../../contexts/UserContext';
import ProductItem from '../Product/ProductItem';
import firebase from "../../firebase";
import ToggleBtn from '../Shared/ToggleBtn';
import { useParams } from 'react-router';

export default function BrandDetail(props) {
  let fullProducts = [];
  const { brandId } = useParams();
  const { brand } = props;
  const brandName = brand["Brand"];
  const description = brand["Description"];
  const logo = brand["Logo"] || "/assets/images/show.png";
  const photo = brand["Photo"] || "/assets/images/show.png";
  const founderName = "Founder Alies Juer";

  const [open, setOpen] = React.useState(brandId ? true : false)
  const { user } = React.useContext(UserContext);
  const [count, setCount] = React.useState(1);
  const [products, setProducts] = React.useState([]);
  const [showList, setShowList] = React.useState([]);
  React.useEffect(() => {
    getFeauturedProducts();
    // eslint-disable-next-line
  }, [count]);
  function getFeauturedProducts() {
    console.log(" brandName : ", brandName)
    let pBrandName = "";
    if (brandName === "Arhaus") pBrandName = "arhaus";
    else if (brandName === "Burrow") pBrandName = "Burrow";
    else if (brandName === "Eternity Modern") pBrandName = "EternityModern";
    else if (brandName === "The Citizenry") pBrandName = "TheCitizenry";
    else if (brandName === "The Inside") pBrandName = "TheInside";
    else if (brandName === "Tom Dixon") pBrandName = "tomdixon";
    else if (brandName === "US-HAY") pBrandName = "US-HAY";

    return firebase.db
      .collection("products")
      .where('brand', '==', pBrandName)
      // .orderBy("votes", "desc")
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

  return (
    <div className="round-section mb-3">
      <ToggleBtn open={open} setOpen={(val) => setOpen(val)} />
      {
        open ?
          <React.Fragment>
            <div className="row no-gutters p-5">
              <div className="col-lg-6 pr-4">
                <div className="d-flex w-100">
                  <img src={photo} className="show-image m-auto" />
                </div>
              </div>
              <div className="col-lg-6 px-3">
                <div className="d-flex">
                  <label className="mb-0">{brandName}</label>
                </div>
                <p className="pr-3 mt-3">
                  {description}
                </p>
              </div>
            </div>
            <div className="p-5">
              <h3 className="section-title">Featured Products by {brandName}</h3>
              <div className="row">
                {
                  products.map((product, index) => <ProductItem key={index} product={product} />)
                }
              </div>
              <div className="row no-gutters mb-5">
                <button className="btn btn-black px-md rounded-0 m-auto" onClick={() => setCount(count + 1)}>See more</button>
              </div>
            </div>
          </React.Fragment>
          :
          <React.Fragment>
            <div className="row no-gutters px-5 py-4">
              <div className="col-12">
                <label className="mb-0">{brandName}</label>
              </div>
            </div>
          </React.Fragment>
      }
    </div >
  )
}
