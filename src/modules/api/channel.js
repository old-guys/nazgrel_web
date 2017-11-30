import _ from 'lodash';
import { fetchResource } from '../../resources';
import {
  channelConfig as channelResource,
  create as createChannelResource
} from '../resources/channel';

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

    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);

    this.resource = channelResource(config);
  }

  async index(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    
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

  async create(patch, config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    this.resource = createChannelResource(config);

    const body = {
      channel: {
        ...patch,
      },
    };

    const create = this.resource.post();
    const response = await fetchResource(create, {
      body: JSON.stringify(body)
    });
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

    return json;
  }
}
