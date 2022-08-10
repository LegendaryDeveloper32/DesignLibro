import { IonContent, IonPage } from '@ionic/react'
import React from 'react'
import BrandsBanner from '../components/Banner/BrandsBanner'
import BrandList from '../components/Brand/BrandList'
import Footer from '../components/Header/Footer'
import Navbar from '../components/Header/Navbar'

export default function Designers() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Navbar title="DesignLibro" />
        <BrandsBanner />
        <div className="content">
          <BrandList />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  )
}
