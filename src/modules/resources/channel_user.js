import { JsonApiResource } from '../../resources';
import qs from 'qs';

export const CHANNEL_USER = 'application.core.channel_user';

export const channelUserConfig = (config) => {

  const { path, params } = config;
  const query = qs.stringify(params, { arrayFormat: 'brackets' });
  let endpoint = 'api/web/channel_users';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
