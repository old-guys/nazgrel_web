import createReducer from '../../store/create-reducer';
import { ShopkeeperApi } from '../api';

const SHOPKEEPER_CHECK = '@SHOPKEEPER_CHECK';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchShopkeeperCheck(params) {
  return dispatch => {
    return ShopkeeperApi.instance().check(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: SHOPKEEPER_CHECK,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export const initialState = {
  shopkeeper: {
    isFetching: true,
    model: {},
  }
};

const actionHandler = {
  [SHOPKEEPER_CHECK]: (state, action) => {
    const model = action.data;
    return { ...state, model };
  }
};

export default createReducer(initialState, actionHandler);
