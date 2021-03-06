import createReducer from '../../../store/create-reducer';
import ReportChannelShopActivityApi from 'api/report/channel_shop_activity';

const REPORT_CHANNEL_SHOP_ACTIVITY_REPORT = '@REPORT_CHANNEL_SHOP_ACTIVITY_REPORT';

function response(res, params) {
  if ((res.code === 0 || res.code === '0') && params.action_type !== 'export') return true;
  return false;
}

export function fetchReport(params) {
  return dispatch => {
    return ReportChannelShopActivityApi.instance().report(params)
      .then((res) => {
        if (response(res, params)) {
          dispatch({
            type: REPORT_CHANNEL_SHOP_ACTIVITY_REPORT,
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
  [REPORT_CHANNEL_SHOP_ACTIVITY_REPORT]: (state, action) => {
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
