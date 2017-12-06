import _ from 'lodash';

export default class Auth {
  constructor() {
    this.userTokenKey = process.platformConfig.apiDomain;
  }

  login(user) {
    localStorage.setItem(this.userTokenKey, JSON.stringify(user));
  }

  currentUser() {
    const str = localStorage.getItem(this.userTokenKey);

    try {
      return JSON.parse(str);
    } catch(e) {
      return {};
    }
  }

  userToken() {
    const user = this.currentUser();

    return user.user_token;
  }

  isLogin() {
  	return !_.isEmpty(this.currentUser());
  }

  logout() {
    localStorage.removeItem(this.userTokenKey);
  }

}
