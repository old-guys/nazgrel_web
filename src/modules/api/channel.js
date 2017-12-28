import _ from 'lodash';
import { fetchResource } from '../../resources';
import channelResource from 'resources/channel';

export default class ChannelApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(ChannelApi._apiInstance)) {
      ChannelApi._apiInstance = new ChannelApi();
    }

    return ChannelApi._apiInstance;
  }

  constructor(config = {}) {
    this.config = config;

    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);

    this.resource = channelResource(config);
  }

  async index(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    this.resource = channelResource({ params: resolvedConfig });
    const index = this.resource.get(resolvedConfig);
    const response = await fetchResource(index);
    const json = await response.json()

    return json;
  }

  async show(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    const show = this.resource.get(resolvedConfig);
    const response = await fetchResource(show);
    const json = await response.json()

    return show;
  }

  async create(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { channel } = resolvedConfig;
    const body = { channel };

    const create = this.resource.create(resolvedConfig);
    const response = await fetchResource(create, { body: JSON.stringify(body) });
    const json = await response.json()

    return json;
  }

  async update(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { channel } = resolvedConfig;
    const { id } = channel;
    const body = { channel };

    this.resource = channelResource({ path: `/${id}` });
    const update = this.resource.update({ id });
    const response = await fetchResource(update, { body: JSON.stringify(body) });
    const json = await response.json()

    return json;
  }
}
