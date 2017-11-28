import _ from 'lodash';
import { fetchResource } from '../../resources';
import {
  shopkeeper as shopkeeperResource,
  check as checkShopkeeperResource
} from '../resources/shopkeeper';

export default class ShopkeeperApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ShopkeeperApi._apiInstance)) {
      ShopkeeperApi._apiInstance = new ShopkeeperApi();
    }

    return ShopkeeperApi._apiInstance;
  }

  constructor(config) {
    this.config = config;

    this.check = this.check.bind(this);

    this.resource = shopkeeperResource(config);
  }

  async check(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    this.resource = checkShopkeeperResource(config);

    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json()

    return json;
  }
}
