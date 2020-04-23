const { Rooms } = App.services

App.HTTP.getRouter('/room')
	.get('/:roomId/messages', (req, res, next) => {
		const {
			params: { roomId },
			query: { dt_from }
		} = req

		Rooms.getMessages(roomId, {
			dtFrom: dt_from && new Date(+dt_from)
		})
			.then(msgs => res.json({
				messages: msgs.map(msg => ({
					messageId: msg.id,
					userId: msg.userId,
					content: msg.content,
					dtSent: msg.dtSent
				}))
			}))
			.catch(next)
	})
