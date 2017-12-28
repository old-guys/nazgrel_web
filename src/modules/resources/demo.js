import { JsonApiResource } from '../../resources';
import qs from 'qs';

export const DEMO = 'application.core.demo';

export default function demoConfig(config) {

  const { path, params } = config;
  const query = qs.stringify(params, { arrayFormat: 'brackets' });
  let endpoint = 'api/web/demos';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
