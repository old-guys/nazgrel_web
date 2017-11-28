import _ from 'lodash';

export default class Auth {
  constructor() {
    this.userTokenKey = process.platformConfig.apiDomain
  }

  login(userToken) {
    localStorage.setItem(this.userTokenKey, userToken)
  }

  userToken() {
  	return localStorage.getItem(this.userTokenKey)
  }

  isLogin() {
  	return !_.isEmpty(this.userToken())
  }

}
