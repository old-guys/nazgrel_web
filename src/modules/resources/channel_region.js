import { JsonApiResource } from '../../resources';
import * as queryString from 'query-string';

export const CHANNEL_REGION = 'application.core.channel_region';

export default function channelRegionConfig(config) {

  const { path, params } = config;
  const query = queryString.stringify(params);
  let endpoint = 'api/web/channel_regions';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
