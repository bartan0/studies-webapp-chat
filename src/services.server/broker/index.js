const jwt = require('jsonwebtoken')

const { Config, WS, WSClient } = App


if (Config.BROKER_URL) {
	const token = jwt.sign(
		{ userId: null },
		Config.JWT_SECRET
	)

	const client = new WSClient(Config.BROKER_URL, 'broker', { token })
		.onMessage((type, p) => {
			if (type === 'event-forwarded')
				WS.emit(p.resource, p.id, p.type, p.payload, {
					noCallbacks: true
				})
		})

	WS.on('emit', event => client.send('event', event))

	module.exports = () => client.connect('broker', null)
}
