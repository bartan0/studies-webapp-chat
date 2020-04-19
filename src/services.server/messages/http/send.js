const {
	HTTP,
	services: {
		Messages
	}
} = App

HTTP.getRouter('/message')
	.post('/:roomId', async (req, res, next) => {
		const {
			user: { id: userId },
			params: { roomId },
			body: { content }
		} = req

		const messageId = await Messages.create({
			userId,
			roomId,
			content
		})

		res.json({ messageId })
	})
