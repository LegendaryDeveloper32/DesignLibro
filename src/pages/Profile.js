import React from 'react'
import { IonContent, IonPage, IonRouterLink } from '@ionic/react'
import Footer from '../components/Header/Footer'
import Navbar from '../components/Header/Navbar'
import UserContext from '../contexts/UserContext'
import firebase from "../firebase";
import ProductItem from "../components/Product/ProductItem";
import InvitationModal from '../components/Product/InvitationModal'
import QuickProfile from './QuickProfile'
import DesignerProfile from './DesignerProfile'
import { useHistory } from 'react-router'
import UserDetailContext from '../contexts/UserDetailContext'

function Profile() {
   const { user, setUser } = React.useContext(UserContext);
   const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
   const [isRecommendModalOpen, setIsRecommendModalOpen] = React.useState(false);

   if (userDetail && userDetail.isInfluencer) return <DesignerProfile isRecommendModalOpen={isRecommendModalOpen} />;
   else return <QuickProfile setIsInfluencer={(val) => setUserDetail({ ...userDetail, isInfluencer: val })} setIsRecommendModalOpen={setIsRecommendModalOpen} />;

}

export default Profile
