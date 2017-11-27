import _ from 'lodash';
import { fetchResource } from '../../resources';
import channelResource, { CHANNEL } from '../resources/channel';

export default class ChannelApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ChannelApi._apiInstance)) {
      ChannelApi._apiInstance = new ChannelApi();
    }

    return ChannelApi._apiInstance;
  }

  constructor(config) {
    this.config = config;

    this.get = this.get.bind(this);
    this.update = this.update.bind(this);

    this.resource = channelResource(config);
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