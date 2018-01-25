import createReducer from '../../../store/create-reducer';
import ReportShopEcnApi from 'api/report/shop_ecn';

const REPORT_SHOP_ECN = '@REPORT_SHOP_ECN';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchIndex(params) {
  return dispatch => {
    return ReportShopEcnApi.instance().index(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: REPORT_SHOP_ECN,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export const initialState = {
  shop_ecns: {
    isFetching: true,
    list: {},
  }
};

const actionHandler = {
  [REPORT_SHOP_ECN]: (state, action) => {
    const res = action.data;
    let list = res.models;

    const shop_ecns = {
      list,
      isFetching: false,
      ...res,
    };

    return { ...state, shop_ecns };
  }
};

export default createReducer(initialState, actionHandler);
