const {
	SQL,
	WS,
	services: { Messages }
} = App

Messages.create = async function ({
	userId,
	roomId,
	content
}) {
	const dtSent = new Date

	const [ [ messageId ] ] = await SQL.request(`
		INSERT INTO messages (user_id, room_id, content)
		OUTPUT INSERTED.id
		VALUES (
			@userId,
			@roomId,
			@content
		)
	`, {
		userId: SQL.ID(userId),
		roomId: SQL.ID(roomId),
		content: SQL.String(content)
	})

	WS.emit('room', roomId, 'message', {
		messageId,
		userId,
		content
	})

	return messageId
}
