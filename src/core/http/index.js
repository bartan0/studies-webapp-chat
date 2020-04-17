const express = require('express')

const auth = require('./auth')


const server = express()
	.use(express.json())
	.use(auth())


module.exports = Object.assign(function () {
	return server
		.get('/status', (req, res) => res.send('OK\n'))
		.get('/version', (req, res) => res.send('v0.0.0\n'))
		.listen(9000)
}, {
	addRouters: routers => routers.forEach(({ router, path }) =>
		server.use(path, router)
	)
})
