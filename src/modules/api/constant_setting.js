import _ from 'lodash';
import { fetchResource } from '../../resources';
import constantSettingResource from 'resources/constant_setting';

export default class ConstantSettingApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ConstantSettingApi._apiInstance)) {
      ConstantSettingApi._apiInstance = new ConstantSettingApi();
    }

    return ConstantSettingApi._apiInstance;
  }

  constructor(config) {
    this.config = config;

    this.enum_field = this.enum_field.bind(this);

    this.resource = constantSettingResource(config);
  }

  async enum_field(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    this.resource = constantSettingResource({ path: '/enum_field', params: resolvedConfig });
    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json();

    return json;
  }
}
