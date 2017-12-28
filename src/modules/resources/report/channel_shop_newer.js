import { JsonApiResource } from '../../../resources';
import qs from 'qs';

export const REPORT_CHANNEL_SHOP_NEWER = 'application.core.channel_shop_newer';

export default function channelShopNewerConfig(config) {

  const { path, params } = config;
  const query = qs.stringify(params, { arrayFormat: 'brackets' });
  let endpoint = 'api/web/report/channel_shop_newers';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
