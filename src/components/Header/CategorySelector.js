import React, { useRef, useState } from 'react'
import clsx from 'clsx';
import useEventListener from '../../hooks/useEventListener';
import firebase from "../../firebase";
import _ from "lodash";

export default function CategorySelector(props) {
  const [open, setOpen] = useState(false);
  const dropdownContainer = useRef(null);
  const [categories, setCategories] = useState([]);
  const handler = (event) => {
    if (open && !dropdownContainer.current.contains(event.target)) setOpen(false);
  };

  React.useEffect(() => {
    getProductCategories();
  }, []);

  const getProductCategories = () => {
    return firebase.db
      .collection("categories")
      .get()
      .then(handleSnapshot);
  }

  const handleSnapshot = (snapshot) => {
    const categories = snapshot.docs.map((doc) => {
      const { category, category_name } = doc.data();
      if (category) return category;
      else if (category_name) return category_name;
    });
    setCategories(_.uniq(_.compact(categories)));
  }

  const handleClickCategory = (ev) => {
    props.setCategory(ev.target.value);
  }

  // Add event listener using our hook
  useEventListener('click', handler);
  return (
    <div className="dropdown show d-flex" ref={dropdownContainer}>
      <button className="btn bg-white border dropdown-toggle ml-auto" type="button" onClick={() => setOpen(!open)}>
        Categories
      </button>
      <div className={clsx("dropdown-menu", open ? "show" : "d-none")}>
        {
          categories.map((category, index) => {
            return <button key={index} className="dropdown-item py-2" value={category} onClick={handleClickCategory}>{category}</button>
          })
        }
        {/* <button className="dropdown-item" value={`Lighting`}>Lighting</button>
        <button className="dropdown-item" value={`Living Room`}>Living Room</button>
        <button className="dropdown-item" value={`Décor`}>Décor</button>
        <button className="dropdown-item" value={`Dining Room`}>Dining Room</button>
        <button className="dropdown-item" value={`Styles`}>Styles</button>
        <button className="dropdown-item" value={`Furniture`}>Furniture</button>
        <button className="dropdown-item" value={`Office`}>Office</button>
        <button className="dropdown-item" value={`Accessories`}>Accessories</button>
        <button className="dropdown-item" value={`House Tours`}>House Tours</button> */}
      </div>
    </div>

  )
}
