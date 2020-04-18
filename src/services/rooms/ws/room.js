const { Rooms } = App.services

App.WS.registerResource('room', async (id, query) => {
	const exists = await Rooms.exists(id)

	if (!exists)
		throw 'room-not-exists'
})
