module.exports = ({ context, router }) =>
	router.post('/:roomId', (req, res, next) => {
		const {
			user: { id: userId },
			params: { roomId },
			body: { content }
		} = req

		context.messages.create({
			userId,
			roomId,
			content
		})
			.then(messageId => res.json({ messageId }))
			.catch(next)
	})
