import { JsonApiResource } from '../../resources';
import qs from 'qs';

export const CHANNEL = 'application.core.channel';

export default function channelConfig(config = {}) {

  const { path, params } = config;
  const query = qs.stringify(params, { arrayFormat: 'brackets' });
  let endpoint = 'api/web/channels';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
