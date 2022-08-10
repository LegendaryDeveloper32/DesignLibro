import { IonRouterLink } from '@ionic/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import useOnclickOutside from 'react-cool-onclickoutside';
import { useHistory, useLocation, useParams, withRouter } from 'react-router'
import UserContext from '../../contexts/UserContext';
import { toast } from '../../utils/toast';
import firebase from "../../firebase";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { INIT_URL } from '../../constants/ActionTypes';

function Navbar(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { user } = React.useContext(UserContext);
  const [keyword, setKeyword] = React.useState("");
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  const { string } = useParams();
  React.useEffect(() => {
    if (string) setKeyword(string);
  }, [string]);

  console.log(" USER ===> ", user);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const modalRef = useOnclickOutside(() => {
    setIsOpenModal(false);
  });
  const menuRef = useOnclickOutside(() => {
    setIsCollapsed(true);
  });
  const handleClickProfileSetting = () => {
    props.history.push("/profile");
  }
  const handleClickLogout = () => {
    dispatch({ type: INIT_URL, payload: "" });
    logoutUser();
  }
  async function logoutUser() {
    try {
      await firebase.logout();
      props.history.push("/login");
      toast("You have logged out successfully.");
    } catch (err) {
      console.error("Logout Error", err);
      toast(err.message);
    }
  }
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      console.log('Enter Press !!');
      if (keyword) history.push(`/search/${keyword}`);
      else history.push(`/home`);
    }
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white" ref={menuRef}>
      <button className="navbar-toggler ml-2" type="button" data-toggle="collapse" onClick={() => setIsCollapsed(!isCollapsed)}>
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse h-100 ml-4" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className={clsx("nav-item d-flex", location.pathname === "/home" ? "active" : "")}>
            <Link className="nav-link" to="/home">Home</Link>
          </li>
          <li className={clsx("nav-item d-flex", location.pathname === "/designers" ? "active" : "")}>
            <Link className="nav-link" to="/designers">Designers</Link>
          </li>
          <li className={clsx("nav-item d-flex", location.pathname === "/brands" ? "active" : "")}>
            <Link className="nav-link" to="/brands">Brands</Link>
          </li>
        </ul>
      </div>
      <a className="navbar-brand" href="#">{props.title}</a>
      <div className="collapse-hide">
        <div className="form-inline position-relative">
          <span className="search-icon"><i className="fa fa-search" /></span>
          <input className="form-control search-input mr-sm-2" type="search" placeholder="Search" aria-label="Search"
            value={keyword}
            onChange={ev => setKeyword(ev.target.value)}
            onKeyDown={handleKeyDown} />
        </div>
      </div>
      <div className="login-section mr-5" onClick={() => {
        if (user) setIsOpenModal(!isOpenModal);
        else props.history.push("/login");
      }}>
        <img className="mr-1" src="/assets/images/icons-images/user-icon.png" />
        <span>{user && user.displayName ? user.displayName : "Log in"}</span>
      </div>
      <div className={clsx("navDropModal", isOpenModal ? "" : "d-none")} ref={modalRef}>
        <div className="navDropItem" onClick={handleClickProfileSetting}>My Profile </div>
        <div className="navDropItem" onClick={handleClickLogout}>Log out</div>
      </div>
      <div className={clsx("collapse-show", isCollapsed && "d-none")}>
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to="/home">Home</Link>
          <Link className="nav-item nav-link" to="/designers">Designers</Link>
          <Link className="nav-item nav-link" to="/brands">Brands</Link>
          <span className="nav-item nav-link m-auto">
            <div className="form-inline position-relative">
              <span className="search-icon"><i className="fa fa-search" /></span>
              <input className="form-control search-input mr-sm-2" type="search" placeholder="Search" aria-label="Search"
                value={keyword}
                onChange={ev => setKeyword(ev.target.value)}
                onKeyDown={handleKeyDown} />
            </div>
          </span>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Navbar);