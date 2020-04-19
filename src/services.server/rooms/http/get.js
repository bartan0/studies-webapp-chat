const { Rooms } = App.services

App.HTTP.getRouter('/rooms')
	.get('/', (req, res, next) => {
		Rooms.get()
			.then(rooms => res.json({
				rooms: rooms.map(room => ({
					roomId: room.id,
					name: room.name
				}))
			}))
			.catch(next)
	})
