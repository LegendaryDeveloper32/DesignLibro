import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import Navbar from "../components/Header/Navbar";
import CategorySelector from "../components/Header/CategorySelector";
import SectionList from "../components/Product/SectionList";
import Footer from "../components/Header/Footer";
import SearchProductList from "../components/Product/SearchProductList";
import SearchBrandList from "../components/Product/SearchBrandList";
import { useParams } from "react-router";

const Search = (props) => {
  const [keyword, setKeyword] = React.useState("");
  const { string } = useParams();
  React.useEffect(() => {
    if (string) setKeyword(string);
  }, [string]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Navbar title="DesignLibro" />
        <div className="content">
          <div>
            <div className="mb-4">
              <h3 className="section-title">Products Related To "{keyword}"</h3>
            </div>
            <SearchProductList keyword={keyword} />
          </div>
          <div>
            <div className="mb-4">
              <h3 className="section-title">Brands Related To "{keyword}"</h3>
            </div>
            <SearchBrandList keyword={keyword} />
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Search;