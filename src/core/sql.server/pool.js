const { Connection } = require('tedious')

const { Config } = App.SQL

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


const createConnection = () => {
	const reconnect = () => setTimeout(
		() => createConnection(),
		Config.reconnectTimeout * 1000
	)

	const conn = new Connection(Config.connectionConfig)
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


App.SQL.Pool = Object.assign(function () {
	for (let i = 0; i < Config.numConnections; i++)
		createConnection()
}, {
	submit
})

module.exports = () => App.SQL.Pool()
