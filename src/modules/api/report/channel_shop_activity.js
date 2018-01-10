import { fetchResource } from '../../../resources';
import channelShopActivityConfig, { REPORT_CHANNEL_SHOP_ACTIVITY } from 'resources/report/channel_shop_activity';

export default class ChannelShopActivityApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ChannelShopActivityApi._apiInstance)) {
      ChannelShopActivityApi._apiInstance = new ChannelShopActivityApi();
    }

    return ChannelShopActivityApi._apiInstance;
  }

  constructor(config = {}) {
    this.config = config;

    this.report = this.report.bind(this);
    this.resource = channelShopActivityConfig(config);
  }

  async report(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    this.resource = channelShopActivityConfig({
      path: '/report',
      params: resolvedConfig
    });

    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json();

    return json;
  }

}
