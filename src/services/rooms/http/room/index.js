const { Router } = require('express')

module.exports = context => {
	return Router()
		.post('/:name', require('./create')(context))
}
