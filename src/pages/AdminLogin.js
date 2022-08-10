import React from "react";

const AdminLogin = ({ history }) => {
   const [password, setPassword] = React.useState("");
   const handleClickClose = () => {
      history.push('/');
   }
   const handleSubmit = () => {
      if (password === "DL12345678!!!") {
         sessionStorage.setItem("isAdmin", true);
         history.push("/admin/product/update");
      } else alert("Admin authentication failed !")
   }
   const handleChange = ev => {
      setPassword(ev.target.value);
   }
   return (
      <div className="bg-modal-gray">
         <div className="product-recommend-modal" style={{ marginTop: "-250px" }}>
            <button className="toggle-btn" onClick={handleClickClose}>
               <img src="/assets/images/close.png" alt="..." />
            </button>
            <div className="d-flex justify-content-center">
               <div className="recommend-form">
                  <div className="form-group mb-5">
                     <label htmlFor="password">Admin Password</label>
                     <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder=""
                        onChange={handleChange}
                        value={password} />
                  </div>

                  <div className="d-flex justify-content-center">
                     <button className="btn btn-black px-md rounded-0" onClick={handleSubmit}>Login</button>
                     <button className="btn cloud-btn px-md rounded-0 mr-3" onClick={handleClickClose}>Cancel</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminLogin;