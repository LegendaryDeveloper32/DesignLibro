import React from 'react'
import firebase from "../../../firebase";
import UserContext from "../../../contexts/UserContext";
import ProductItem from "../ProductItem";
import _ from "lodash";
import currencyFormatter from "currency-formatter";

export default function Trending(props) {
   const { category } = props;
   const { user } = React.useContext(UserContext);
   const [count, setCount] = React.useState(1);
   const [products, setProducts] = React.useState([]);

   React.useEffect(() => {
      getTrendingProducts();
   }, [category, count]);

   function getTrendingProducts() {
      if (category) return firebase.db
         .collection("products")
         .where('category', '==', category)
         .where('votedByInfluencer', "==", false)
         .orderBy('voteCount', 'desc')
         .limit(4 * count)
         .get()
         .then(handleSnapshot);
      return firebase.db
         .collection("products")
         .where('votedByInfluencer', "==", false)
         .orderBy('voteCount', 'desc')
         .limit(4 * count)
         .get()
         .then(handleSnapshot);
   }

   function handleSnapshot(snapshot) {
      const products = snapshot.docs.map((doc) => {
         return { id: doc.id, ...doc.data() };
      });
      const sortedArr = products.sort((firstEl, secondEl) => {
         const voteCount1 = firstEl.voteCount;
         const voteCount2 = secondEl.voteCount;
         const price1 = currencyFormatter.unformat(firstEl.price, { code: 'USD' });
         const price2 = currencyFormatter.unformat(secondEl.price, { code: 'USD' });
         if (voteCount1 === voteCount2) {
            if (price1 < price2) {
               return -1;
            }
            if (price1 > price2) {
               return 1;
            }
         }
         return 0;
      });
      setProducts(sortedArr);
   }

   return (
      <React.Fragment>
         <div className="mb-4">
            <h3 className="section-title">Trending on Design Libro</h3>
         </div>
         <div className="row">
            {
               products.map((product, index) => <ProductItem key={index} product={product} />)
            }
         </div>
         <div className="row mb-5">
            <button className="btn btn-black px-md rounded-0 ml-auto" onClick={() => setCount(count + 1)}>See more</button>
         </div>
      </React.Fragment>
   )
}
