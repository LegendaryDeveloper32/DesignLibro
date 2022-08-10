import React from 'react'
import UserContext from '../../contexts/UserContext';
import firebase from "../../firebase";
import DesignerDetail from './DesignerDetail';

export default function DesignerList() {
  const { user } = React.useContext(UserContext);
  const [designers, setDesigners] = React.useState([]);
  const [count, setCount] = React.useState(1);
  React.useEffect(() => {
    getInfluencers();
    // eslint-disable-next-line
  }, [user, count]);

  const getInfluencers = () => {
    return firebase.db
      .collection("userProfiles")
      .where('isInfluencer', "==", true)
      .limit(4 * count)
      .get()
      .then(handleSnapshot);
  }

  const handleSnapshot = (snapshot) => {
    const list = snapshot.docs.map((doc) => {
      return { ...doc.data() };
    });

    setDesigners(list);
  }
  console.log("designers: ", designers)
  return (
    <>
      {
        designers.map((designerData, index) => {
          return <DesignerDetail key={index} designerData={designerData} />;
        })
      }
      <div className="row no-gutters mb-5">
        <button className="btn btn-black px-md rounded-0 m-auto" onClick={() => setCount(count + 1)}>See more</button>
      </div>
    </>
  )
}
