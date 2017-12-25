import createReducer from '../../store/create-reducer';
import DemoApi from '../api/demo';

const DEMO_ALL = '@DEMO_ALL';
const DEMO_SHOW = '@DEMO_SHOW';
const DEMO_CREATE = '@DEMO_CREATE';
const DEMO_UPDATE = '@DEMO_UPDATE';
const DEMO_DESTROY = '@DEMO_DESTROY';

function response(res) {
  if (res.code === 0 || res.code === '0') return true;
  return false;
}

export function fetchDemoAll(params) {
  return dispatch => {
    return DemoApi.instance().index(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: DEMO_ALL,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export function fetchDemoShow(params) {
  return dispatch => {
    return DemoApi.instance().show(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: DEMO_SHOW,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export function fetchCreateDemo(params) {
  return dispatch => {
    return DemoApi.instance().create(params)
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: DEMO_CREATE,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export function fetchUpdateDemo(params) {
  return dispatch => {
    return DemoApi.instance().update(params, {id: params.id})
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: DEMO_UPDATE,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export function fetchDestroyDemo(params) {
  return dispatch => {
    return DemoApi.instance().update(params, {id: params.id})
      .then((res) => {
        if (response(res)) {
          dispatch({
            type: DEMO_DESTROY,
            data: res.data,
          });
        }
        return res;
      });
  };
}

export const initialState = {
  demos: {
    isFetching: true,
    list: {},
  },
  details: {},
};

const actionHandler = {
  [DEMO_ALL]: (state, action) => {
    const res = action.data;
    let list = res.models;

    const demos = {
      list,
      isFetching: false,
      ...res,
    };

    return { ...state.demos, demos };
  },
  [DEMO_SHOW]: (state, action) => {
    const record = action.data;
    return { ...state, record };
  },
  [DEMO_CREATE]: (state, action) => {
    const record = action.data;
    return { ...state, record };
  },
  [DEMO_UPDATE]: (state, action) => {
    const record = action.data;
    return { ...state, record };
  },
  [DEMO_DESTROY]: (state, action) => {
    const record = action.data;
    return { ...state, record };
  }
};

export default createReducer(initialState, actionHandler);
