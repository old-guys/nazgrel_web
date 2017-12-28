import { JsonApiResource } from '../../resources';
import qs from 'qs';

export const CONSTANT_SETTING = 'application.core.constant_setting';
export const CONSTANT_SETTING_ENUM_FIELD = 'application.core.constant_setting.enum_field';

export default function constantSettingConfig(config = {}) {

  const { path, params } = config;
  const query = qs.stringify(params, { arrayFormat: 'brackets' });
  let endpoint = 'api/web/constant_setting';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
