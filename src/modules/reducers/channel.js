import createReducer from '../../store/create-reducer';
import ChannelApi from 'api/channel';

const CHANNEL_ALL = '@CHANNEL_ALL';
const CHANNEL_SHOW = '@CHANNEL_SHOW';
const CHANNEL_CREATE = '@CHANNEL_CREATE';
const CHANNEL_UPDATE = '@CHANNEL_UPDATE';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchChannelAll(params) {
  return dispatch => {
    return ChannelApi.instance().index(params)
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

export function fetchChannelShow(params) {
  return dispatch => {
    return ChannelApi.instance().show(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: CHANNEL_SHOW,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export function createChannel(params) {
  return dispatch => {
    return ChannelApi.instance().create(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: CHANNEL_CREATE,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export function updateChannel(params) {
  return dispatch => {
    return ChannelApi.instance().update(params, {id: params.id})
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: CHANNEL_UPDATE,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export const initialState = {
  channels: {
    isFetching: true,
    list: {},
  },
  details: {},
};

const actionHandler = {
  [CHANNEL_ALL]: (state, action) => {
    const res = action.data;
    let list = res.models;

    const channels = {
      list,
      isFetching: false,
      ...res,
    };

    return { ...state.channels, channels };
  },
  [CHANNEL_CREATE]: (state, action) => {
    const record = action.data;
    return { ...state, record };
  },
  [CHANNEL_UPDATE]: (state, action) => {
    const record = action.data;
    return { ...state, record };
  },
  [CHANNEL_SHOW]: (state, action) => {
    const record = action.data;
    return { ...state, record };
  }
};

export default createReducer(initialState, actionHandler);
