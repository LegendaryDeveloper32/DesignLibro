import React from 'react'
import firebase from "../../../firebase";
import UserContext from "../../../contexts/UserContext";
import ProductItem from "../ProductItem";

export default function New(props) {
   const { category } = props;
   const { user } = React.useContext(UserContext);
   const [count, setCount] = React.useState(1);
   const [allProducts, setAllProducts] = React.useState([]);
   const [products, setProducts] = React.useState([]);

   React.useEffect(() => {
      getNewProducts();
   }, [category, count]);

   function getNewProducts() {
      if (category) return firebase.db
         .collection("products")
         .where('category', '==', category)
         .orderBy("created", "desc")
         .limit(4 * count)
         .get()
         .then(handleSnapshot);
      return firebase.db
         .collection("products")
         .orderBy("created", "desc")
         .limit(4 * count)
         .get()
         .then(handleSnapshot);
   }

   function handleSnapshot(snapshot) {
      const fullList = snapshot.docs.map((doc) => {
         return { id: doc.id, ...doc.data() };
      });
      console.log(" fullList : ", fullList)
      setProducts(fullList);
   }

   return (
      <React.Fragment>
         <div className="mb-4">
            <h3 className="section-title">What's New</h3>
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
