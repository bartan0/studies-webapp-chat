const { client } = require('websocket')

const { WS } = App

const URL = 'ws://localhost:9100/broker'

new client()
	.on('connect', conn => {
		console.log('Connected to broker')

		WS.on('emit', event => conn.sendUTF(JSON.stringify({
			type: 'event',
			payload: event
		})))

		conn.on('message', ({ utf8Data }) => {
			const { type, payload: p } = JSON.parse(utf8Data)

			if (type === 'event-forwarded')
				WS.emit(
					p.resource,
					p.id,
					p.type,
					p.payload,
					{ noCallbacks: true }
				)
		})
	})
	.on('connectFailed', err => console.error(err.toString()))
	.connect(URL, [ 'chat' ], 'localhost', {
		'Authorization': 'Bearer foobar'
	})
