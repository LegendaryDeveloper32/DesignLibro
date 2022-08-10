import React from "react";
import firebase from "../../firebase";
import UserContext from "../../contexts/UserContext";
import ProductItem from "./ProductItem";
import _ from 'lodash';
import algoliasearch from 'algoliasearch';

const ALGOLIA_APP_ID = "2ST4X7FK1A";
const ALGOLIA_API_KEY = "be3336ac32a2c5b6bb581b41e54544f5";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = client.initIndex("products");

const SearchProductList = (props) => {
  const { keyword } = props;
  const { user } = React.useContext(UserContext);
  const [count, setCount] = React.useState(1);
  const [allProducts, setAllProducts] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    index.search(keyword).then((data) => {
      console.log(" data.hits: ", data.hits);
      setAllProducts(data.hits);
    });
  }, [keyword]);

  React.useEffect(() => {
    setProducts(allProducts.slice(0, 4 * count));
  }, [count, allProducts]);

  return (
    <div>
      <div className="row">
        {products.map((product, index) => <ProductItem key={index} product={product} />)}
      </div>
      <div className="row mb-5">
        <button className="btn btn-black px-md rounded-0 ml-auto" onClick={() => setCount(count + 1)}>See more</button>
      </div>
    </div>
  )
};

export default SearchProductList;