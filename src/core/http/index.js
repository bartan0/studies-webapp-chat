const { createServer } = require('http')
const express = require('express')

const { Router, json } = express
const { Config } = App

const routers = new Map
const server = express()
	.use(json())

const httpServer = createServer(server)


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
	getHTTPServer: () => httpServer,
	getRouter
}))

module.exports = () => {
	server
		.get('/status', (req, res) => res.send('OK\n'))
		.get('/version', (req, res) =>
			res.send(`${App.package.name} v${App.package.version}\n`)
		)
		.use((err, req, res, next) => {
			console.error('HTTP:', err.toString())

			res.sendStatus(500)
		})

	httpServer.listen(Config.PORT)
}
