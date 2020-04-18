const { server } = require('websocket')
const { match } = require('path-to-regexp')

const connections = new Map
const resources = new Map

const getParams = (parsePath =>
	({
		resourceURL: {
			pathname,
			query
		}
	}) => {
		const { params } = parsePath(pathname) || {}

		if (!params)
			throw 'wrong-params'

		return { params, query }
	}
)
	(match('/:resource/:id?'))


const wsServer = new server()
	.on('request', req => {
		App.HTTP.authorizeHTTPRequest(req.httpRequest)
			.then(async () => {
				if (!req.requestedProtocols.includes('chat'))
					return req.reject(400, 'unsupported-protocol')

				const {
					params: {
						resource,
						id
					},
					query
				} = getParams(req)

				const cb = resources.get(resource)

				if (!cb)
					throw 'wrong-params'

				await cb(id, query)

				const key = `${resource}:${id}`

				const conns = connections.get(key)
				const conn = Object.assign(req.accept('chat', req.origin), { key })

				if (conns)
					conns.push(conn)
				else
					connections.set(conn.key, [ conn ])
			})
			.catch(err => req.reject(401, err))
	})
	.on('connect', () => {
		console.log('WS connection established')
	})
	.on('close', conn => {
		console.log('WS connection closed')

		const conns = connections.get(conn.key)
		const i = conns.findIndex(c => c.key === conn.key)

		if (i >= 0)
			conns.splice(i, 1)
	})


App.registerCoreService('WS', {
	registerResource (resource, cb) {
		resources.set(resource, cb)
	}
	,
	emit (resource, id, type, payload) {
		const key = `${resource}:${id}`
		const conns = connections.get(key)

		if (conns)
			conns.forEach(conn => conn.sendUTF(JSON.stringify({ type, payload })))
	}
})


module.exports = () => wsServer.mount({
	httpServer: App.HTTP.getHTTPServer()
})
