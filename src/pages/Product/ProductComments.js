import React from 'react'
import ProductComment from '../../components/Product/ProductComment';
import clsx from 'clsx';
import UserDetailContext from '../../contexts/UserDetailContext';

export default function ProductComments(props) {
  const { userDetail } = React.useContext(UserDetailContext);
  const isInfluencer = userDetail ? userDetail.isInfluencer : false;
  return (
    <div className="row no-gutters mb-5">
      <div className="d-flex w-100">
        <h3 className="section-title">Recommendation from Designers</h3>
        <button className={clsx("btn btn-black px-md rounded-0 ml-auto mt-auto mb-auto", isInfluencer ? "" : "d-none")} style={{ height: 38 }} onClick={() => props.setIsModalOpen(true)}>Recommend a product</button>
      </div>
      {Array.isArray(props.product.comments) && props.product.comments.map((comment, index) => (
        <ProductComment
          key={index}
          index={index}
          comment={comment}
          product={props.product}
          setProduct={props.setProduct}
        />
      ))}
    </div>
  )
}
