import { JsonApiResource } from '../../resources';
import qs from 'qs';

export const CHANNEL_REGION = 'application.core.channel_region';

export default function channelRegionConfig(config) {

  const { path, params } = config;
  const query = qs.stringify(params, { arrayFormat: 'brackets' });
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
