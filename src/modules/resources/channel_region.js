import { JsonApiResource } from '../../resources';

export const CHANNEL_REGION = 'application.core.channel_region';

export default function channelRegionConfig(config) {

  const endpoint = `api/web/channel_regions/{id}?filters={filters}&json_key={json_key}&page={page}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
