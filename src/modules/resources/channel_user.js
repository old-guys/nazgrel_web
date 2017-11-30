import { JsonApiResource } from '../../resources';
import * as queryString from 'query-string';

export const CHANNEL_USER = 'application.core.channel_user';

export const channelUserConfig = (config) => {

  const { path, params } = config;
  const query = queryString.stringify(params);
  let endpoint = 'api/web/channel_users';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
