import { JsonApiResource } from '../../resources';

import * as queryString from 'query-string';

export const CONSTANT_SETTING = 'application.core.constant_setting';
export const CONSTANT_SETTING_ENUM_FIELD = 'application.core.constant_setting.enum_field';

export const constant_setting = (config) => {

  const endpoint = `api/web/constant_setting`;

  const resource = {
    schema: CONSTANT_SETTING,
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}

export const enum_field = (config) => {
  const query = queryString.stringify(config.params);
  const endpoint = `api/web/constant_setting/enum_field?${query}`;

  const resource = {
    schema: CONSTANT_SETTING_ENUM_FIELD,
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
