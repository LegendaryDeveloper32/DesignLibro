import { FETCH_ERROR, FETCH_START, FETCH_SUCCESS, HIDE_MESSAGE, SHOW_MESSAGE } from '../constants/ActionTypes'

const INIT_STATE = {
   error: "",
   loading: false,
   message: '',
   type: null
};

export default (state = INIT_STATE, action) => {
   switch (action.type) {
      case FETCH_START: {
         return { ...state, error: '', message: '', loading: true, type: action.payload };
      }
      case FETCH_SUCCESS: {
         return { ...state, error: '', message: '', loading: false, type: null };
      }
      case SHOW_MESSAGE: {
         return { ...state, error: '', message: action.payload, loading: false, type: null };
      }
      case FETCH_ERROR: {
         return { ...state, loading: false, error: action.payload, message: '', type: null };
      }
      case HIDE_MESSAGE: {
         return { ...state, loading: false, error: '', message: '', type: null };
      }
      default:
         return state;
   }
}
