import _ from 'lodash';
import { fetchResource } from '../../resources';
import demoConfig, { DEMO } from 'resources/demo';

export default class DemoApi {
  static _apiInstance = null;

  static instance() {
    if (_.isEmpty(DemoApi._apiInstance)) {
      DemoApi._apiInstance = new DemoApi();
    }

    return DemoApi._apiInstance;
  }

  constructor(config = {}) {
    this.config = config;

    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);

    this.resource = demoConfig(config);
  }

  async index(config = {}) {
    const resolvedConfig = { ...this.config, ...config };

    this.resource = demoConfig({ params: resolvedConfig });
    const get = this.resource.get(resolvedConfig);
    // const response = await fetchResource(get);
    // const json = await response.json()

    return {
      code: 0,
      data: {
        current_page: 1,
        models: [
          { id: 1, name: 'x1', created_at: '2017-12-15T15:34:18.000+08:00', updated_at: '2017-12-15T15:34:18.000+08:00'},
          { id: 2, name: 'x2', created_at: '2017-12-15T15:34:18.000+08:00', updated_at: '2017-12-15T15:34:18.000+08:00'},
          { id: 3, name: 'x3', created_at: '2017-12-15T15:34:18.000+08:00', updated_at: '2017-12-15T15:34:18.000+08:00'},
        ],
        per_page: 2,
        total_count: 3,
        total_pages: 2,
        next_page: null
      }
    };
  }

  async show(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { demo, demo: { id } } = resolvedConfig;

    this.resource = demoConfig({ path: `/${id}`, params: resolvedConfig });
    const get = this.resource.get(resolvedConfig);
    const response = await fetchResource(get);
    const json = await response.json()

    return json;
  }

  async create(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { demo } = resolvedConfig;
    const body = { demo };

    const create = this.resource.create(resolvedConfig);
    // const response = await fetchResource(create, { body: JSON.stringify(body) });
    // const json = await response.json()


    return {
      code: 0,
      data: {
        id: 1,
        name: 'x1',
        created_at: '2017-12-15T15:34:18.000+08:00',
        updated_at: '2017-12-15T15:34:18.000+08:00'
      }
    };
  }

  async update(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { demo, demo: {id} } = resolvedConfig;
    const body = { demo };

    this.resource = demoConfig({ path: `/${id}` });
    const update = this.resource.update({ id });
    // const response = await fetchResource(update, { body: JSON.stringify(body) });
    // const json = await response.json()

    return {
      code: 0,
      data: {
        id: 1,
        name: 'x1',
        created_at: '2017-12-15T15:34:18.000+08:00',
        updated_at: '2017-12-15T15:34:18.000+08:00'
      }
    };
  }

  async destroy(config = {}) {
    const resolvedConfig = { ...this.config, ...config };
    const { demo, demo: {id} } = resolvedConfig;

    this.resource = demoConfig({ path: `/${id}` });
    const destroy = this.resource.destroy({ id });
    // const response = await fetchResource(destroy);
    // const json = await response.json()

    return {
      code: 0,
      data: {
        id: 1,
        name: 'x1',
        created_at: '2017-12-15T15:34:18.000+08:00',
        updated_at: '2017-12-15T15:34:18.000+08:00'
      }
    };
  }
}
