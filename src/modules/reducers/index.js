import { combineReducers } from 'redux'
import channel from './channel';
import auth from './auth';

export default combineReducers({
  channel,
  auth
});