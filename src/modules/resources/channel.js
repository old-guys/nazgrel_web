import { JsonApiResource } from '../../resources';

export const CHANNEL = 'application.core.channel';
export const CHANNEL_CREATE = 'application.core.channel.create';

export const channelConfig = (config) => {

  const endpoint = `api/web/channels/{id}?filters={filters}&json_key={json_key}&page={page}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}

export const create = (config) => {
  const endpoint = `api/web/channels`;

  const resource = {
    schema: CHANNEL_CREATE,
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
