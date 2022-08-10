import React from 'react'
import { useParams } from 'react-router';
import UserContext from '../../contexts/UserContext';
import firebase from "../../firebase";
import BrandDetail from './BrandDetail';

export default function BrandList() {
  const { brandId } = useParams();
  const { user } = React.useContext(UserContext);
  const [brands, setBrands] = React.useState([]);
  const [count, setCount] = React.useState(1);
  React.useEffect(() => {
    getBrands();
    // eslint-disable-next-line
  }, [count]);

  const getBrands = () => {
    return firebase.db
      .collection("brand")
      .limit(4 * count)
      .get()
      .then(handleSnapshot);
  }
  const handleSnapshot = (snapshot) => {
    let docList = snapshot.docs.map((doc) => { return { id: doc.id, ...doc.data() }; });
    if (brandId) docList = docList.filter(doc => { return doc.id === brandId });
    setBrands(docList);
  }

  return (
    <>
      {
        brands.map((brand, index) => {
          return <BrandDetail brand={brand} key={index} />
        })
      }
      <div className="row no-gutters mb-5">
        <button className="btn btn-black px-md rounded-0 m-auto" onClick={() => setCount(count + 1)}>See more</button>
      </div>
    </>
  )
}
