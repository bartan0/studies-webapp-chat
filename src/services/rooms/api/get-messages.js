const { SQL, services: { Rooms } } = App

Rooms.getMessages = async function (roomId) {
	const messages = await SQL.request(`
		SELECT id, user_id, dt_sent, content
		FROM messages
		WHERE room_id = @roomId
		ORDER BY dt_sent
	`, {
		roomId: SQL.ID(roomId)
	})

	return messages.map(([ id, userId, dtSent, content ]) =>
		({ id, userId, dtSent, content })
	)
}
