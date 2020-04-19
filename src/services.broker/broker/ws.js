const { WS } = App

WS.registerResource('broker', {
	verify () {}
	,
	message ({ type, payload }) {
		if (type === 'event')
			WS.emit('broker', null, 'event-forwarded', payload)
	}
})
