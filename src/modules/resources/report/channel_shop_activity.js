import { JsonApiResource } from '../../../resources';
import qs from 'qs';

export const REPORT_CHANNEL_SHOP_ACTIVITY = 'application.core.channel_shop_activity';

export default function channelShopActivityConfig(config) {

  const { path, params } = config;
  const query = qs.stringify(params, { arrayFormat: 'brackets' });
  let endpoint = 'api/web/report/channel_shop_activities';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
