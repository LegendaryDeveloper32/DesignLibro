import React from "react";
import firebase from "../../firebase";
import UserContext from "../../contexts/UserContext";
import { IonRouterLink } from "@ionic/react";
import { Link } from "react-router-dom";

const SearchBrandList = (props) => {
  const { keyword } = props;
  const { user } = React.useContext(UserContext);
  const [count, setCount] = React.useState(1);
  const [brands, setBrands] = React.useState([]);

  React.useEffect(() => {
    getSearchBrands();
    // eslint-disable-next-line
  }, [keyword, count]);

  function getSearchBrands() {
    return firebase.db
      .collection("brand")
      .get()
      .then(handleSnapshot);
  }

  function handleSnapshot(snapshot) {
    const brands = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    const filteredBrands = brands.filter(brand => {
      const brandName = brand["Brand"] || "";
      const description = brand["Description"] || "";
      if (description.toLowerCase().includes(keyword.toLowerCase()) || brandName.toLowerCase().includes(keyword.toLowerCase())) return true;
      else return false;
    })
    setBrands(filteredBrands);
  }
  console.log(" brands +++ ", brands)
  return (
    <div>
      <div className="row">
        {brands.map((brand, index) => {
          const brandId = brand["id"];
          const brandName = brand["Brand"] || brand["Brand Name"] || brand["BrandName"] || "";
          const description = brand["Description"] || "";
          const logo = brand["Logo"] || "/assets/images/show.png";
          const photo = brand["Photo"] || "/assets/images/show.png";
          return (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
              <div className="ps-item">
                <div className="ps-item-thumbnail">
                  <img src={logo} alt="product image" />
                  <Link className="ps-item-overlay" to={`/brands/${brandId}`} />
                </div>
                <div className="ps-item-content">
                  <div className="ps-item-detail">
                    <Link className="ps-item-name" to={`/brands/${brandId}`} >{brandName}</Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="row mb-5">
        <button className="btn btn-black px-md rounded-0 ml-auto" onClick={() => setCount(count + 1)}>See more</button>
      </div>
    </div>
  )
};

export default SearchBrandList;