const { HTTP, services: { Messages } } = App

HTTP.getRouter('/message')
	.post('/:roomId', (req, res, next) => {
		const {
			user: { id: userId },
			params: { roomId },
			body: { content }
		} = req

		Messages.create({
			userId,
			roomId,
			content
		})
			.then(messageId => res.json({ messageId }))
			.catch(next)
	})
