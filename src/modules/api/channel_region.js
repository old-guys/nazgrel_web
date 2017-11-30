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

  constructor(config = {}) {
    this.config = config;

    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.create = this.create.bind(this);
    this.deleteChannel = this.deleteChannel.bind(this);

    this.resource = channelRegionResource(config);
  }

  async get(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json()

    return json;
  }

  async create(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { channel_region } = resolvedConfig;
    const body = { channel_region };

    const create = this.resource.create(resolvedConfig);
    const response = await fetchResource(create, { body: JSON.stringify(body) });
    const json = await response.json()

    return json;
  }

  async update(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { channel_region } = resolvedConfig;
    const { id } = channel_region;
    const body = { channel_region };

    this.resource = channelRegionResource({ path: `/${id}` });

    const update = this.resource.update({ id });
    const response = await fetchResource(update, { body: JSON.stringify(body) });
    const json = await response.json()

    return json;
  }

  async deleteChannel(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { channel_region_map } = resolvedConfig;
    const { channel_region_id, channel_id } = channel_region_map;

    this.resource = channelRegionResource({
      path: '/destroy_channel',
      params: {
        id: channel_region_id,
        channel_id
      }
    });

    const destroy = this.resource.destroy({ channel_region_id });
    const response = await fetchResource(destroy);
    const json = await response.json()

    return json;
  }
}
