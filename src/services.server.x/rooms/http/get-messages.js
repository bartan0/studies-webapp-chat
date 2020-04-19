const { Rooms } = App.services

App.HTTP.getRouter('/room')
	.get('/:roomId/messages', async (req, res) => {
		const { params: { roomId } } = req
		const messages = await Rooms.getMessages(roomId)

		res.json({
			messages: messages.map(msg => ({
				messageId: msg.id,
				userId: msg.userId,
				content: msg.content,
				dtSent: msg.dtSent
			}))
		})
	})
