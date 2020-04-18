const { Rooms } = App.services

App.HTTP.getRouter('/rooms')
	.get('/', async (req, res) => {
		const rooms = await Rooms.get()

		res.json({
			rooms: rooms.map(room => ({
				roomId: room.id,
				name: room.name
			}))
		})
	})
