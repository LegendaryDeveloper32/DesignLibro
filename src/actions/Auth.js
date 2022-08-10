import {
   INIT_URL,
} from "../constants/ActionTypes";

export const setInitUrl = (url) => {
   return {
      type: INIT_URL,
      payload: url
   };
};
