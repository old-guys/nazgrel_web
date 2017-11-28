import _ from 'lodash'

export const defaultResource = {
	actions: {
		get: {
			request: {
				method: 'GET',
			},
		},
		create: {
			request: {
				method: 'POST',
			},
		},
		update: {
			request: {
				method: 'PATCH',
			},
		},
		remove: {
			request: {
				method: 'DELETE',
			},
		},
	},
}

export const jsonApiResource = _.merge({}, defaultResource, {
	request: {
		headers: {
			'Accept': 'application/json',
		},
	},
	actions: {
		create: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
			},
		},
		update: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
			},
		},
	},
})