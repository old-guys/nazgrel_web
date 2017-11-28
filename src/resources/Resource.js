import _ from 'lodash'
import UriTemplate from 'urijs/src/URITemplate';

import { defaultResource } from './default.config'

export default class Resource {
	constructor(resourceConfig, templateResource = defaultResource) {
		this.registerActions = this.registerActions.bind(this)

		const resource = _.merge({}, templateResource, resourceConfig)
		const { actions } = resource

		this.resourceConfig = _.omit(resource, 'actions')
		this.actions = actions;

		this.registerActions()
	}

	registerActions() {
		_.mapKeys(this.actions, (actionConfig, actionKey) => {
			const resource = _.merge({}, this.resourceConfig, actionConfig)
			this[actionKey] = (params = {}) => {

				const endpoint = new UriTemplate(resource.request.endpoint).expand(params)

				return _.merge({}, resource, {
					request: {
						endpoint,
					},
				})
			}
		})
	}
}