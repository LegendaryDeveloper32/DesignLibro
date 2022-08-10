import React from "react";
import {
   IonPage,
   IonContent,
   IonButton,
   IonGrid,
   IonRow,
   IonCol,
} from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";

import firebase from "../../firebase";
import productService from "../../services/product";
import { Plugins } from "@capacitor/core";
import UserContext from "../../contexts/UserContext";
import NavHeader from "../../components/Header/NavHeader";
import ProductItem from "../../components/Product/ProductItem";
import ProductPhotos from "../../components/Product/ProductPhotos";
import ProductComment from "../../components/Product/ProductComment";
import CommentModal from "../../components/Product/CommentModal";
import Footer from "../../components/Header/Footer";
import Navbar from "../../components/Header/Navbar";
import ProductOverview from "./ProductOverview";
import ProductStory from "./ProductStory";
import ProductComments from "./ProductComments";
import UserDetailContext from "../../contexts/UserDetailContext";
import MyRecommendModal from '../../components/Product/MyRecommendModal';

const { Browser } = Plugins;

const Product = (props) => {
   const [product, setProduct] = React.useState(null);
   const productId = props.match.params.productId;
   const productRef = firebase.db.collection("products").doc(productId);
   const [isModalOpen, setIsModalOpen] = React.useState(false);

   React.useEffect(() => {
      getProduct();
      // eslint-disable-next-line
   }, [productId]);

   function getProduct() {
      productRef
         .get()
.then(doc => {
            const docDetail = doc.data();
            if (!docDetail) props.history.push('/home');
            setProduct({ ...docDetail, id: doc.id });
         })
   }

   return (
      <IonPage>
         <IonContent>
            <Navbar title="DesignLibro" />
            <div className="content">
               {product && (
                  <>
                     <ProductOverview product={product} setProduct={setProduct} />
                     <ProductStory product={product} />
                     <ProductComments product={product} setProduct={setProduct} setIsModalOpen={setIsModalOpen} />
                  </>
               )}
            </div>
            <Footer />
            {
               isModalOpen &&
               <MyRecommendModal closeModal={() => setIsModalOpen(false)} product={product} />
            }
         </IonContent>
      </IonPage>
   );
};

export default Product;