const { Router } = require('express')

module.exports = context => {
	const router = Router()

	require('./send')({ context, router })

	return [ { router, path: '/message' } ]
}
