const { Rooms } = App.services

App.WS.registerResource('room', {
	async verify (id, query) {
		const exists = await Rooms.exists(id)

		if (!exists)
			throw 'room-not-exists'
	}
})
