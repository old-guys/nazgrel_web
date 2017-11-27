import createReducer from '../../store/create-reducer';
import { ChannelApi } from '../api';

const CHANNEL_ALL = '@ORDER_ALL';
const CHANNEL_DETAILS = '@ORDER_DETAILS';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchChannelAll(params) {
  return dispatch => {
    return ChannelApi.instance().get(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: CHANNEL_ALL,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export function fetchChannelDetails(params) {
  return dispatch => {
    return ChannelApi.instance().get(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: CHANNEL_DETAILS,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export const initialState = {
  todayOrder: {
    isFetching: true,
    list: [],
  },
  orders: {
    isFetching: true,
    list: {},
  },
  details: {},
};

const actionHandler = {
  [CHANNEL_ALL]: (state, action) => {

    const res = action.data;
    let list = res.models;
    if (Number(res.current_page) > 1) list = [...state.orders.list, ...res.models];

    const orders = {
      list,
      isFetching: false,
      ...res,
    };

    return { ...state, orders };
  },
  [CHANNEL_DETAILS]: (state, action) => {
    const details = action.data;
    return { ...state, details };
  }
};

export default createReducer(initialState, actionHandler);

