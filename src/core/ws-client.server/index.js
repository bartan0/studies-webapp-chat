const { client } = require('websocket')

const Config = {
	reconnectTimeout: 3
}

const instances = new Map


App.registerCoreService('WSClient',
	Object.assign(function (urlBase, id, options = {}) {
		instances.set(id, Object.assign(this, {
			connection: null,
			queue: [],
			callbacks: [],

			connect (resource, id, force) {
				if (this.connection && !force)
					return

				const reconnect = () => setTimeout(
					() => this.connect(resource, id, true),
					Config.reconnectTimeout * 1000
				)

				this.connection = true
				new client()
					.on('connect', conn => {
						console.log('WSClient: Connected')

						this.connection = conn
							.on('message', ({ utf8Data }) => {
								const { type, payload } = JSON.parse(utf8Data)

								this.callbacks.forEach(cb => cb(type, payload))
							})
							.on('close', (code, desc) => {
								console.error(`WSClient: Connection closed: [${code}] ${desc}`)
								reconnect()
							})

						this.queue.forEach(data => this.connection.sendUTF(data))
						this.queue = []
					})
					.on('connectFailed', err => {
						console.error('WSClient: Unable to connect:', err.toString())
						reconnect()
					})
					.connect(
						`${urlBase}/${resource}/${id || ''}`,
						[ 'chat' ],
						'localhost',
						Object.assign({},
							options.token && { 'Authorization': `Bearer ${options.token}` }
						)
					)

				return this
			}
			,
			send (type, payload) {
				const data = JSON.stringify({
					type,
					payload
				})

				if (this.connection && this.connection !== true)
					this.connection.sendUTF(data)
				else
					this.queue.push(data)

				return this
			}
			,
			onMessage (cb) {
				this.callbacks.push(cb)

				return this
			}
		}))
	}, {
		get (id) {
			return instances.get(id)
		}
	})
)
