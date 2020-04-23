const { HTTP, services: { Rooms } } = App

HTTP.getRouter('/room')
	.post('/:name', (req, res, next) => {
		const {
			user,
			params: { name },
			// body: { membersIds }
		} = req

		Rooms.create(name, {
			membersIds: [ user.id ]
		})
			.then(roomId => res.json({ roomId }))
			.catch(next)
	})
