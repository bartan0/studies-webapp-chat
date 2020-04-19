const { HTTP, services: { Rooms } } = App

HTTP.getRouter('/room')
	.post('/:name', (req, res, next) => {
		const {
			params: { name },
			body: { membersIds }
		} = req

		Rooms.create(name, {
			membersIds
		})
			.then(roomId => res.json({ roomId }))
			.catch(next)
	})
