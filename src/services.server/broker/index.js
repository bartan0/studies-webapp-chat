const { Config, WS, WSClient } = App

let URL = `http://${Config.BROKER_HOST}`

if (Config.BROKER_PORT)
	URL += `:${Config.BROKER_PORT}`

const client = new WSClient(URL, 'broker')
	.onMessage((type, p) => {
		if (type === 'event-forwarded')
			WS.emit(p.resource, p.id, p.type, p.payload, {
				noCallbacks: true
			})
	})

WS.on('emit', event => client.send('event', event))

module.exports = () => client.connect('broker', null)
