import createReducer from '../../store/create-reducer';
import { AuthApi } from '../api';

const UPDATE_TOKEN = '@UPDATE_TOKEN';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchAuthLogin(params) {
  return dispatch => {
    return AuthApi.instance().login(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: UPDATE_TOKEN,
            data: res.data,
          });
        }
        return res;
      });
  };
}

const initialState = {
  userToken: ''
};

const actionHandler = {
  [UPDATE_TOKEN]: (state, action) => {
    const res = action.data;
    const userToken = res.user_token;

    return { ...state, userToken };
  },
};

export default createReducer(initialState, actionHandler);