import { combineReducers } from 'redux';
import constant_setting from './constant_setting';
import channel from './channel';
import shopkeeper from './shopkeeper';
import auth from './auth';

export default combineReducers({
  constant_setting,
  channel,
  shopkeeper,
  auth
});
