import React from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";
import useFormValidation from "../hooks/useFormValidation";
import validateUpdateProduct from "../components/Product/validateUpdateProduct";
import firebase from "../firebase";
import UserContext from "../contexts/UserContext";
import SmallHeader from "../components/Header/SmallHeader";
import LargeHeader from "../components/Header/LargeHeader";
import Upload from "../components/Form/Upload";
import { toast } from "../utils/toast";
import clsx from "clsx";

const INITIAL_STATE = {
  brand: "",
  category: "",
  title: "",
  description: "",
  url: "",
  thumbnail: "",
  photos: [],
  productStory: "",
  productStoryPhoto: ""
};

const ProductUpdate = ({ history }) => {
  const { user } = React.useContext(UserContext);
  const [submitting, setSubmitting] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState([]);
  const [productStoryPhoto, setProductStoryPhoto] = React.useState([]);
  const [photos, setPhotos] = React.useState([]);
  const [productID, setProductID] = React.useState("");
  const [product, setProduct] = React.useState(null);
  const { handleSubmit, handleChange, values, setValues, isSubmitting } = useFormValidation(
    INITIAL_STATE,
    validateUpdateProduct,
    handleUpdate
  );
  React.useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) history.push("/");
  }, []);
  async function handleUpdate() {
    try {
      if (!user) {
        history.push("/login");
        return;
      }

      setSubmitting(true);

      const { brand, category, title, description, url, thumbnail, photos, productStory, productStoryPhoto } = values;
      const productRef = firebase.db.collection("products").doc(productID);

      await productRef.update({ productStory, productStoryPhoto });
      await productRef.update({ brand, category, title, description, url, thumbnail, photos });
      history.push(`/product/${productID}`)
    } catch (e) {
      console.error(e);
      toast(e.message);
      setSubmitting(false);
    }
  }


  const getProduct = () => {
    const productRef = firebase.db.collection("products").doc(productID);
    productRef
      .get()
      .then(doc => {
        const docDetail = doc.data();
        console.log(" productDetaildocDetail == ", docDetail)
        if (!docDetail) {
          toast("ProductID is invalid.");
          setProductID("");
        }
        else setProduct({ ...docDetail, id: doc.id });
      });
  }
  const handleDeleteProduct = () => {
    if (productID) {
      const productRef = firebase.db.collection("products").doc(productID);
      productRef.delete().then(() => {
        toast("Product was removed successfully!")
      }).catch((error) => {
        toast("Error removing document.");
      });
    } else {
      toast("Should input ID for product!");
    }
  }
  React.useEffect(() => {
    if (product) {
      const {
        brand,
        category,
        title,
        description,
        url,
        thumbnail,
        photos,
        productStoryPhoto,
        productStory
      } = product;
      setValues({
        brand,
        category,
        title,
        description,
        url,
        thumbnail,
        photos,
        productStoryPhoto,
        productStory
      });
    }
  }, [product]);

  React.useEffect(() => {
    if (Array.isArray(productStoryPhoto) && productStoryPhoto.length > 0) updateProductStoryPhoto();
    async function updateProductStoryPhoto() {
      await Promise.all([
        ...productStoryPhoto.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${productID}_storyphoto_${index}.jpg`)
            .put(f)
        )
      ]);

      const productThumbs = await Promise.all(
        productStoryPhoto.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${productID}_storyphoto_${index}.jpg`)
            .getDownloadURL()
        )
      );
      setValues({ ...values, productStoryPhoto: productThumbs[0] });
    }
  }, [productStoryPhoto]);

  React.useEffect(() => {
    if (Array.isArray(thumbnail) && thumbnail.length > 0) updateThumb();
    async function updateThumb() {
      await Promise.all([
        ...thumbnail.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${productID}_thumb_${index}.jpg`)
            .put(f)
        )
      ]);

      const productThumbs = await Promise.all(
        thumbnail.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${productID}_thumb_${index}.jpg`)
            .getDownloadURL()
        )
      );
      setValues({ ...values, thumbnail: productThumbs[0] });
    }
  }, [thumbnail]);

  React.useEffect(() => {
    if (Array.isArray(photos) && photos.length > 0) updatePhotos();
    async function updatePhotos() {
      await Promise.all([
        ...photos.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${productID}_photo_${index}.jpg`)
            .put(f)
        ),
      ]);

      const productPhotos = await Promise.all(
        photos.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${productID}_photo_${index}.jpg`)
            .getDownloadURL()
        )
      );
      setValues({ ...values, photos: productPhotos });
    }
  }, [photos]);

  const handleDownload = (imageURL) => {
    console.log(" imageURLimageURL ==> ", imageURL)

    var httpsReference = firebase.storage.refFromURL(imageURL);
    httpsReference.getDownloadURL()
      .then((url) => {
        console.log(" ddddddddddddddd ==> ", url)
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element
        // var img = document.getElementById('myimg');
        // img.setAttribute('src', url);
      })
      .catch((error) => {
        // Handle any errors
      });

  }
  console.log(" ttttttttttttttt === ", values)
  return (
    <IonPage>
      <SmallHeader title="Product Update" />
      <IonContent>
        <LargeHeader title="Product Update" />

        <IonItem lines="full">
          <IonLabel position="floating">Input ID of product to query Product information</IonLabel>
          <IonInput
            name="productID"
            value={productID}
            type="text"
            onIonChange={ev => setProductID(ev.target.value)}
            required
          ></IonInput>
        </IonItem>

        <IonRow>
          <IonCol>
            <IonButton
              type="submit"
              color="primary"
              expand="block"
              disabled={submitting}
              onClick={getProduct}
            >
              Query
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              type="submit"
              color="primary"
              expand="block"
              disabled={submitting}
              onClick={handleDeleteProduct}
            >
              Delete
            </IonButton>
          </IonCol>
        </IonRow>
        <div className={clsx(product ? "" : "d-none")}>
          <IonItem lines="full">
            <IonLabel position="floating">Brand</IonLabel>
            <IonInput
              name="brand"
              value={values.brand}
              type="text"
              onIonChange={handleChange}
              required
            ></IonInput>
          </IonItem>

          <IonItem lines="full">
            <IonLabel position="floating">Category</IonLabel>
            <IonInput
              name="category"
              value={values.category}
              type="text"
              onIonChange={handleChange}
              required
            ></IonInput>
          </IonItem>

          <IonItem lines="full">
            <IonLabel position="floating">Title</IonLabel>
            <IonInput
              name="title"
              value={values.title}
              type="text"
              onIonChange={handleChange}
              required
            ></IonInput>
          </IonItem>

          <IonItem lines="full">
            <IonLabel position="floating">Description</IonLabel>
            <IonInput
              name="description"
              value={values.description}
              type="text"
              onIonChange={handleChange}
              required
            ></IonInput>
          </IonItem>

          <IonItem lines="full">
            <IonLabel position="floating">Product Story</IonLabel>
            <IonInput
              name="productStory"
              value={values.productStory}
              type="text"
              onIonChange={handleChange}
              required
            ></IonInput>
          </IonItem>
          {
            values.productStoryPhoto &&
            <IonRow>
              <a
                href={values.productStoryPhoto}
                target="_blank"
                // onClick={() => handleDownload(values.productStoryPhoto)}
                download
              >
                <img src={values.productStoryPhoto} alt="productStoryPhoto" width="104" height="142" />
              </a>
            </IonRow>
          }

          <IonRow>
            <IonCol>
              <Upload
                files={productStoryPhoto}
                onChange={setProductStoryPhoto}
                placeholder="Update ProductStoryPhoto"
              />
            </IonCol>
          </IonRow>
          <IonItem lines="full">
            <IonLabel position="floating">Product URL</IonLabel>
            <IonInput
              name="url"
              value={values.url}
              type="text"
              onIonChange={handleChange}
              required
            ></IonInput>
          </IonItem>

          <IonRow>
            <a
              href={values.thumbnail}
              target="_blank"
              // onClick={() => handleDownload(values.thumbnail)}
              download
            >
              <img src={values.thumbnail} alt="thumbnail" width="104" height="142" />
            </a>
          </IonRow>

          <IonRow>
            <IonCol>
              <Upload
                files={thumbnail}
                onChange={setThumbnail}
                placeholder="Update Logo"
              />
            </IonCol>
          </IonRow>

          <IonRow>
            {
              Array.isArray(values.photos) &&
              values.photos.map((photo, index) => {
                return (
                  <a
                    key={index}
                    href={photo}
                    target="_blank"
                    // onClick={() => handleDownload(photo)}
                    download
                  >
                    <img src={photo} alt="photo" width="104" height="142" />
                  </a>
                );
              })
            }
          </IonRow>

          <IonRow>
            <IonCol>
              <Upload
                files={photos}
                onChange={setPhotos}
                placeholder="Update Photos"
                multiple
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton
                type="submit"
                color="primary"
                expand="block"
                disabled={submitting}
                onClick={handleSubmit}
              >
                Update
            </IonButton>
            </IonCol>
          </IonRow>
        </div>

      </IonContent>
    </IonPage >
  );
};

export default ProductUpdate;