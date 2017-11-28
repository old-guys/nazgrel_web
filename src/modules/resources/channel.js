import { JsonApiResource } from '../../resources';

export const CHANNEL = 'application.core.channel';

export default function channelConfig(config) {

  const endpoint = `api/web/channels/{id}?filters={filters}&json_key={json_key}&page={page}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
