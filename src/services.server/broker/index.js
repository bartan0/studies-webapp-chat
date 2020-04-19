const { WS, WSClient } = App
const URL = 'ws://localhost:9100'

const client = new WSClient(URL, 'broker')
	.onMessage((type, p) => {
		if (type === 'event-forwarded')
			WS.emit(p.resource, p.id, p.type, p.payload, {
				noCallbacks: true
			})
	})

WS.on('emit', event => client.send('event', event))

module.exports = () => client.connect('broker', null)
