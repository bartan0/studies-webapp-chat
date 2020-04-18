const { createServer } = require('http')
const express = require('express')

const { Router, json } = express

const routers = new Map
const server = express()
	.use(json())

const httpServer = createServer(server)


const authorizeBasic = value => Buffer.from(value, 'base64').toString().split(':')[0]

const authorizeHTTPRequest = req => new Promise((resolve, reject) => {
	const [ type, value ] = (req.headers['authorization'] || '').split(' ')

	if (type === 'Basic') {
		req.user = {
			id: authorizeBasic(value || '')
		}

		return resolve()
	}

	reject('not-authorized')
})

const getRouter = path => {
	let router = routers.get(path)

	if (router)
		return router

	router = Router()
	server.use(path, router)
	routers.set(path, router)

	return router
}


App.registerCoreService('HTTP', Object.assign(server, {
	authorizeHTTPRequest,
	getHTTPServer: () => httpServer,
	getRouter
}))

module.exports = () => {
	server
		.get('/status', (req, res) => res.send('OK\n'))
		.get('/version', (req, res) => res.send('v0.0.0\n'))

	httpServer.listen(9000)
}
