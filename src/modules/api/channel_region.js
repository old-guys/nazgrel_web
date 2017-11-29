import _ from 'lodash';
import { fetchResource } from '../../resources';
import channelRegionResource, { CHANNEL_REGION } from '../resources/channel_region';

export default class ChannelRegionApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ChannelRegionApi._apiInstance)) {
      ChannelRegionApi._apiInstance = new ChannelRegionApi();
    }

    return ChannelRegionApi._apiInstance;
  }

  constructor(config) {
    this.config = config;

    this.get = this.get.bind(this);
    this.update = this.update.bind(this);

    this.resource = channelRegionResource(config);
  }

  async get(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json()

    return json;
  }

  async update(patch, config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { id } = resolvedConfig;

    const body = {
      data: {
        id: id,
        ...patch,
      },
    };

    const update = this.resource.update({ id });
    const response = await fetchResource(update, { body: JSON.stringify(body) });
    const json = await response.json()

    return json.data;
  }
}
