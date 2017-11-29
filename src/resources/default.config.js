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
		post: {
			request: {
				method: 'POST',
			},
		},
		update: {
			request: {
				method: 'PATCH',
			},
		},
		patch: {
			request: {
				method: 'PATCH',
			},
		},
		remove: {
			request: {
				method: 'DELETE',
			},
		},
		destroy: {
			request: {
				method: 'DELETE',
			},
		},
		delete: {
			request: {
				method: 'DELETE',
			},
		}
	},
}

export const jsonApiResource = _.merge({}, defaultResource, {
	request: {
		headers: {
			'Accept': 'application/json',
		},
	},
	actions: {
		get: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			},
		},
		create: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			},
		},
		post: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			},
		},
		update: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'PATCH',
			},
		},
		patch: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'PATCH',
			},
		},
		remove: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'DELETE',
			},
		},
		destroy: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'DELETE',
			},
		},
		delete: {
			request: {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'DELETE',
			},
		}
	},
})
