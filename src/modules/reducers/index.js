import { combineReducers } from 'redux';
import constant_setting from './constant_setting';
import channel from './channel';
import shopkeeper from './shopkeeper';
import auth from './auth';
import channel_region from './channel_region';
import channel_user from './channel_user';
import demo from './demo';
import report_channel_shop_newer from './report/channel_shop_newer';
import report_channel_shop_activity from './report/channel_shop_activity';
import report_shop_ecn from './report/shop_ecn';

export default combineReducers({
  constant_setting,
  channel,
  shopkeeper,
  auth,
  channel_region,
  channel_user,
  demo,
  report_channel_shop_newer,
  report_channel_shop_activity,
  report_shop_ecn
});
