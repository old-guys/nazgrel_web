import createReducer from '../../store/create-reducer';
import ChannelUserApi from 'api/channel_user';

const CHANNEL_USER_DETAILS = '@CHANNEL_USER_DETAILS';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function updateChannelUser(params) {
  return dispatch => {
    return ChannelUserApi.instance().update(params)
      .then((res) => {
        return res;
      });
  };
}

export const initialState = {
  details: {},
};

const actionHandler = {
  [CHANNEL_USER_DETAILS]: (state, action) => {
    const details = action.data;
    return { ...state, details };
  }
};

export default createReducer(initialState, actionHandler);
