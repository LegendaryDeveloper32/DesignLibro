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
import validateCreateBrand from "../components/Product/validateCreateBrand";
import firebase from "../firebase";
import UserContext from "../contexts/UserContext";
import SmallHeader from "../components/Header/SmallHeader";
import LargeHeader from "../components/Header/LargeHeader";
import Upload from "../components/Form/Upload";
import { toast } from "../utils/toast";

const INITIAL_STATE = {
  Brand: "",
  Description: "",
  Photo: "",
  Logo: ""
};

const BrandSubmit = ({ history }) => {
  const { user } = React.useContext(UserContext);
  const [submitting, setSubmitting] = React.useState(false);
  const [thumb, setThumb] = React.useState([]);
  const [photos, setPhotos] = React.useState([]);
  const { handleSubmit, handleChange, values } = useFormValidation(
    INITIAL_STATE,
    validateCreateBrand,
    handleCreate
  );
  React.useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) history.push("/");
  }, []);
  async function handleCreate() {
    try {
      if (!user) {
        history.push("/login");
        return;
      }

      setSubmitting(true);

      const { Brand, Description, Photo, Logo } = values;
      const id = firebase.db.collection("brand").doc().id;

      await Promise.all([
        ...thumb.map((f, index) =>
          firebase.storage
            .ref()
            .child(`brand/${id}_thumb_${index}.jpg`)
            .put(f)
        ),
        ...photos.map((f, index) =>
          firebase.storage
            .ref()
            .child(`brand/${id}_photo_${index}.jpg`)
            .put(f)
        ),
      ]);

      const brandPhotos = await Promise.all(
        photos.map((f, index) =>
          firebase.storage
            .ref()
            .child(`brand/${id}_photo_${index}.jpg`)
            .getDownloadURL()
        )
      );

      const brandLogos = await Promise.all(
        thumb.map((f, index) =>
          firebase.storage
            .ref()
            .child(`brand/${id}_thumb_${index}.jpg`)
            .getDownloadURL()
        )
      );
      const querySnapshot = await firebase.db
        .collection("brand")
        .where('Brand', '==', Brand)
        .get();
      if (querySnapshot.empty) {
        const newProduct = {
          Brand,
          Description,
          Logo: brandLogos[0] || "",
          Photo: brandPhotos[0] || "",
          created: Date.now(),
        };
        setThumb([]);
        setPhotos([]);
        await firebase.db.collection("brand").doc(id).set(newProduct);
      } else {
        const brandDoc = querySnapshot.docs[0];
        const brandDetail = brandDoc.data();
        await brandDoc.ref.update({
          Brand,
          Description,
          Logo: brandLogos[0] || "",
          Photo: brandPhotos[0] || "",
          created: Date.now(),
        });
      }
      history.push("/brands");
    } catch (e) {
      console.error(e);
      toast(e.message);
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <SmallHeader title="Brand Submit" />
      <IonContent>
        <LargeHeader title="Brand Submit" />
        <IonItem lines="full">
          <IonLabel position="floating">Brand Name</IonLabel>
          <IonInput
            name="Brand"
            value={values.Brand}
            type="text"
            onIonChange={handleChange}
            required
          ></IonInput>
        </IonItem>

        <IonItem lines="full">
          <IonLabel position="floating">Description</IonLabel>
          <IonInput
            name="Description"
            value={values.Description}
            type="text"
            onIonChange={handleChange}
            required
          ></IonInput>
        </IonItem>
        <IonRow>
          <IonCol>
            <Upload
              files={thumb}
              onChange={setThumb}
              placeholder="Select Logo"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <Upload
              files={photos}
              onChange={setPhotos}
              placeholder="Select Photo"
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
              Submit
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default BrandSubmit;