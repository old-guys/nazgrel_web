import createReducer from '../../store/create-reducer';
import ConstantSettingApi from 'api/constant_setting';

const CONSTANT_SETTING_ENUM_FIELD = '@CONSTANT_SETTING_ENUM_FIELD';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchEnumField(params) {
  return dispatch => {
    return ConstantSettingApi.instance().enum_field(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: CONSTANT_SETTING_ENUM_FIELD,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export const initialState = {
  enum_field: {
    isFetching: true,
    model: {},
  }
};

const actionHandler = {
  [CONSTANT_SETTING_ENUM_FIELD]: (state, action) => {
    const model = action.data;
    return { ...state.enum_field, model };
  }
};

export default createReducer(initialState, actionHandler);
