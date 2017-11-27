export default class AuthApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(AuthApi._apiInstance)) {
      AuthApi._apiInstance = new AuthApi();
    }

    return AuthApi._apiInstance;
  }

  async login(config = {}) {
    const platformConfig = process.platformConfig;
    const endpoint = `${platformConfig.apiDomain}api/web/auth/login?device=web`;

    const params = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    };
    const response = await fetch(endpoint, params);
    const json = await response.json();

    return json;
  }
}