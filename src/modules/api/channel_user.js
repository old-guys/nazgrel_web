import _ from 'lodash';
import { fetchResource } from '../../resources';
import {
  channelUserConfig as channelUserResource,
} from '../resources/channel_user';

export default class ChannelUserApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ChannelUserApi._apiInstance)) {
      ChannelUserApi._apiInstance = new ChannelUserApi();
    }

    return ChannelUserApi._apiInstance;
  }

  constructor(config = {}) {
    this.config = config;

    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.resource = channelUserResource(config);
  }

  async get(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json()

    return json;
  }

  async update(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { channel_user } = resolvedConfig;
    const { id } = channel_user;
    const body = { channel_user };

    this.resource = channelUserResource({ path: `/${id}` });
    const update = this.resource.update({ id });
    const response = await fetchResource(update, { body: JSON.stringify(body) });
    const json = await response.json()

    return json;
  }
}
