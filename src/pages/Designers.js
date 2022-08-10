import { IonContent, IonPage } from '@ionic/react'
import React from 'react'
import DesignerBrand from '../components/Banner/DesignerBanner'
import DesignerList from '../components/Designer/DesignerList'
import Footer from '../components/Header/Footer'
import Navbar from '../components/Header/Navbar'

export default function Designers() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Navbar title="DesignLibro" />
        <DesignerBrand />
        <div className="content">
          <DesignerList />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  )
}
