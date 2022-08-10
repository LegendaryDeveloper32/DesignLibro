import React from 'react'
import { toast } from '../../utils/toast';
import firebase from "../../firebase";

export default function ProductStory({ product }) {

  const [brand, setBrand] = React.useState("");
  const [story, setStory] = React.useState("");
  const [image, setImage] = React.useState("/assets/images/story-image.png");

  React.useEffect(() => {
    const {
      brand,
      productStory, productStoryPhoto
    } = product;
    setBrand(brand);
    if (productStory && productStoryPhoto) {
      setStory(productStory);
      setImage(productStoryPhoto);
    } else {
      firebase.db
        .collection("brand")
        .get()
        .then(snapshot => {
          const { docs } = snapshot;
          const dList = docs.map(doc => { return { ...doc.data() }; });
          console.log(" dList ==> ", dList)
          const mBrand = dList.find(item => {
            const brandName = item['brand'] || item['Brand'] || "";
            const processedBrand = brandName.toLowerCase().split(' ').join('');
            const productBrand = brand ? brand.toLowerCase().split(' ').join('') : "";
            console.log("processedBrand => ", processedBrand)
            console.log("productBrand => ", productBrand)
            if (processedBrand === productBrand) return true;
            else return false;
          })
          const brandDescription = mBrand['description'] || mBrand['Description'] || "";
          const brandPhoto = mBrand['photo'] || mBrand['Photo'] || "/assets/images/show.png";

          productStory ? setStory(productStory) : setStory(brandDescription);
          productStoryPhoto ? setImage(productStoryPhoto) : setImage(brandPhoto);
        });
    }
  }, [product]);

  return (
    <div className="row no-gutters mb-5">
      <h3 className="section-title w-100">Brand &amp; Product Story</h3>
      <div className="row no-gutters w-100">
        <div className="col-lg-8 col-md-6 col-sm-12">
          <label>{brand}</label>
          <p className="pr-3">{story}</p>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <img className="story-image" src={image} />
        </div>
      </div>
    </div>

  )
}
