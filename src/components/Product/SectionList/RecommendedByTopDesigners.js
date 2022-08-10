import React from 'react'
import firebase from "../../../firebase";
import UserContext from "../../../contexts/UserContext";
import ProductItem from "../ProductItem";

export default function RecommendedByTopDesigners(props) {
   const { category } = props;
   const { user } = React.useContext(UserContext);
   const [count, setCount] = React.useState(1);
   const [products, setProducts] = React.useState([]);

   React.useEffect(() => {
      getRBTDProducts();
   }, [category, count]);

   function getRBTDProducts() {
      if (category) return firebase.db
         .collection("products")
         .where('category', '==', category)
         .where('votedByInfluencer', "==", true)
         .orderBy('voteCount', 'desc')
         .limit(4 * count)
         .get()
         .then(handleSnapshot);
      return firebase.db
         .collection("products")
         .where('votedByInfluencer', "==", true)
         .orderBy('voteCount', 'desc')
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
      <React.Fragment>
         <div className="mb-4">
            <h3 className="section-title">Recommended by Top Designers</h3>
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
