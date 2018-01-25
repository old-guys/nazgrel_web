import { JsonApiResource } from '../../../resources';
import qs from 'qs';

export const REPORT_SHOP_ECN = 'application.core.shop_ecn';

export default function shopEcnConfig(config) {

  const { path, params } = config;
  const query = qs.stringify(params, { arrayFormat: 'brackets' });
  let endpoint = 'api/web/report/shop_ecns';

  if (!_.isEmpty(path)) endpoint = `${endpoint}${path}`;
  if (!_.isEmpty(query)) endpoint = `${endpoint}?${query}`;

  const resource = {
    request: {
      endpoint,
    },
  };

  return new JsonApiResource(resource);
}
