import _ from 'lodash';
import JsonApiResource from './JsonResource';
import Resource from './Resource';
import { Auth } from '../modules/services'

const fetchOptionResolver = _.flow([
	options => _.pick(options, ['method', 'body', 'headers', 'credentials']),
	options => _.omitBy(options, _.isNil),
])

const fetchResource = (resource, options ={}) => {
	const { request } = resource
	const { endpoint, ...resourceOptions } = request

	const resolvedOptions = {
		...fetchOptionResolver(resourceOptions),
		...options,
	}

	const platformConfig = process.platformConfig;

	const auth = new Auth();
	const userToken = auth.userToken();

	let c = "?";
	if (endpoint.indexOf(c) !== -1) c = '&';

	let url = `${endpoint}${c}device=web&user_token=${userToken}`;

	if (endpoint.indexOf('http://') === -1) {
		url = `${platformConfig.apiDomain}${url}`;
	}

	return fetch(url, resolvedOptions)
}

export {
	JsonApiResource,
	Resource,
	fetchResource,
};
