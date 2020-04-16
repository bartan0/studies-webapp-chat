const { Connection } = require('tedious')

const readyConnections = []
const requestQueue = []


const submit = (request, connection) => {
	if (request) {
		if (connection)
			return connection.execSql(
				request.on('requestCompleted',
					() => submit(null, connection)
				)
			)

		if (!readyConnections.length)
			return requestQueue.push(request)

		connection = readyConnections.shift()

		return submit(request, connection)
	}

	if (!requestQueue.length)
		return readyConnections.push(connection)

	request = requestQueue.shift()

	return submit(request, connection)
}


const removeConnection = conn => {
	const i = readyConnections.findIndex(c => c === conn)

	if (i >= 0)
		readyConnections.splice(i, 1)
}


const createConnection = config => {
	const reconnect = () => setTimeout(
		() => createConnection(config),
		config.reconnectTimeout * 1000
	)

	const conn = new Connection(config.connectionConfig)
		.on('connect', err => {
			if (err) {
				console.error(err.toString())

				return conn.close()
			}

			console.log('Connection established')

			submit(null, conn)
		})
		.on('error', err => {
			console.error(err.toString())
			conn.close()
		})
		.on('end', () => {
			console.log('Connection ended, reconnecting...')

			removeConnection(conn)
			reconnect()
		})
}


module.exports = Object.assign(function (config) {
	for (let i = 0; i < config.numConnections; i++)
		createConnection(config)
}, {
	submit
})
