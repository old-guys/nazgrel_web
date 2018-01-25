import _ from 'lodash';
import { fetchResource } from '../../../resources';
import shopEcnConfig, { REPORT_SHOP_ECN } from 'resources/report/shop_ecn';

export default class ShopEcnApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ShopEcnApi._apiInstance)) {
      ShopEcnApi._apiInstance = new ShopEcnApi();
    }

    return ShopEcnApi._apiInstance;
  }

  constructor(config = {}) {
    this.config = config;

    this.index = this.index.bind(this);
    this.resource = shopEcnConfig(config);
  }

  async index(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    this.resource = shopEcnConfig({ params: resolvedConfig });

    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json();

    return json;
  }

}
