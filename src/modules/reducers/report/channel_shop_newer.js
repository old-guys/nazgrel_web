import createReducer from '../../../store/create-reducer';
import { ReportChannelShopNewerApi } from '../../api';

const REPORT_CHANNEL_SHOP_NEWER_REPORT = '@CHANNEL_SHOW';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchReport(params) {
  return dispatch => {
    return ReportChannelShopNewerApi.instance().report(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: REPORT_CHANNEL_SHOP_NEWER_REPORT,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export const initialState = {
  report: {
    isFetching: true,
    list: {},
  }
};

const actionHandler = {
  [REPORT_CHANNEL_SHOP_NEWER_REPORT]: (state, action) => {
    const res = action.data;
    let list = res.models;

    const report = {
      list,
      isFetching: false,
      ...res,
    };

    return { ...state, report };
  }
};

export default createReducer(initialState, actionHandler);
