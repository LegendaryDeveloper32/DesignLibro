import {
   INIT_URL
} from "../constants/ActionTypes";

const INIT_STATE = {
   token: localStorage.getItem('token'),
   initURL: ""
};


export default (state = INIT_STATE, action) => {
   switch (action.type) {
      case INIT_URL: {
         return { ...state, initURL: action.payload };
      }
      default:
         return state;
   }
}
