import React from 'react'
import New from './New';
import RecommendedByTopDesigners from './RecommendedByTopDesigners';
import Trending from './Trending';

export default function SectionList(props) {
   const { category } = props;

   return (
      <React.Fragment>
         <RecommendedByTopDesigners category={category} />
         <Trending category={category} />
         <New category={category} />
      </React.Fragment>
   );

}
