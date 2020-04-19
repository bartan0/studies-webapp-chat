const {
	HTTP,
	services: {
		Rooms
	}
} = App


HTTP.getRouter('/room')
	.post('/:name', async (req, res, next) => {
		const {
			params: { name },
			body: { membersIds }
		} = req

		const roomId = await Rooms.create(name, {
			membersIds
		})

		res.json({ roomId })
	})
