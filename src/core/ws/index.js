const { server } = require('websocket')
const { authorizeHTTPRequest } = require('lib')
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


const ws = new server()
	.on('request', req => {
		authorizeHTTPRequest(req.httpRequest)
			.then(() => {
				if (!req.requestedProtocols.includes('chat'))
					return req.reject(400, 'unsupported-protocol')

				const {
					params: {
						resource,
						id
					},
					query
				} = getParams(req)

				console.log('foo')

				const cb = resources.get(resource)

				if (!cb)
					throw 'wrong-params'

				console.log('before cb')

				cb(id, query)

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


module.exports = Object.assign(function (httpServer) {
	ws.mount({ httpServer })
}, {
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
