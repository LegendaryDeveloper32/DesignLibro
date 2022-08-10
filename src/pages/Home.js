import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import Navbar from "../components/Header/Navbar";
import CategorySelector from "../components/Header/CategorySelector";
import SectionList from "../components/Product/SectionList";
import Footer from "../components/Header/Footer";
import UserContext from "../contexts/UserContext";

const Home = (props) => {
  const [category, setCategory] = React.useState(null);
  return (
    <IonPage>
      <IonContent fullscreen>
        <Navbar title="DesignLibro" />
        <div className="content">
          <CategorySelector setCategory={setCategory} />
          <SectionList category={category} />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Home;