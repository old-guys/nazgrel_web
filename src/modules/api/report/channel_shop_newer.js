import _ from 'lodash';
import { fetchResource } from '../../../resources';
import channelShopNewerConfig, { REPORT_CHANNEL_SHOP_NEWER } from 'resources/report/channel_shop_newer';

export default class ChannelShopNewerApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ChannelShopNewerApi._apiInstance)) {
      ChannelShopNewerApi._apiInstance = new ChannelShopNewerApi();
    }

    return ChannelShopNewerApi._apiInstance;
  }

  constructor(config = {}) {
    this.config = config;

    this.report = this.report.bind(this);
    this.resource = channelShopNewerConfig(config);
  }

  async report(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    this.resource = channelShopNewerConfig({
      path: '/report',
      params: resolvedConfig
    });

    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json();

    return json;
  }

}
