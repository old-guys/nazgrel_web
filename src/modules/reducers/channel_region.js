import createReducer from '../../store/create-reducer';
import { ChannelRegionApi } from '../api';

const CHANNEL_REGION_ALL = '@CHANNEL_REGION_ALL';
const CHANNEL_REGION_DETAILS = '@CHANNEL_REGION_DETAILS';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchChannelRegionAll(params) {
  return dispatch => {
    return ChannelRegionApi.instance().get(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: CHANNEL_REGION_ALL,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export function fetchChannelRegionDetails(params) {
  return dispatch => {
    return ChannelRegionApi.instance().get(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: CHANNEL_REGION_DETAILS,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export const initialState = {
  channel_regions: {
    isFetching: true,
    list: {},
  },
  details: {},
};

const actionHandler = {
  [CHANNEL_REGION_ALL]: (state, action) => {

    const res = action.data;
    let list = res.models;
    if (Number(res.current_page) > 1) list = [...state.channel_regions.list, ...res.models];

    const channel_regions = {
      list,
      isFetching: false,
      ...res,
    };

    return { ...state, channel_regions };
  },
  [CHANNEL_REGION_DETAILS]: (state, action) => {
    const details = action.data;
    return { ...state, details };
  }
};

export default createReducer(initialState, actionHandler);
