import { JsonApiResource } from '../../resources';
import * as queryString from 'query-string';

export const SHOPKEEPER = 'application.core.shopkeeper';
export const SHOPKEEPER_CHECK = 'application.core.shopkeeper.check';

export default function shopkeeperConfig(config = {}) {

  const { path, params } = config;
  const query = queryString.stringify(params);
  let endpoint = 'api/web/shopkeepers';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
