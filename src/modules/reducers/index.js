import { combineReducers } from 'redux';
import constant_setting from './constant_setting';
import channel from './channel';
import shopkeeper from './shopkeeper';
import auth from './auth';
import channel_region from './channel_region';
import channel_user from './channel_user';

export default combineReducers({
  constant_setting,
  channel,
  shopkeeper,
  auth,
  channel_region,
  channel_user
});
