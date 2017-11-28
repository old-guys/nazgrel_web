import { JsonApiResource } from '../../resources';

import * as queryString from 'query-string';

export const SHOPKEEPER = 'application.core.shopkeeper';
export const SHOPKEEPER_CHECK = 'application.core.shopkeeper.check';

export const shopkeeper = (config) => {

  const endpoint = `api/web/shopkeepers`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}

export const check = (config) => {
  const query = queryString.stringify(config.params);
  const endpoint = `api/web/shopkeepers/check?${query}`;

  const resource = {
    schema: SHOPKEEPER_CHECK,
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
