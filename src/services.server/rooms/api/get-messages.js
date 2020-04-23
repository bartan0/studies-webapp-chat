const { SQL, services: { Rooms } } = App

Rooms.getMessages = async function (
	roomId, options = {}
) {
	const messages = await SQL.request(`
		SELECT id, user_id, dt_sent, content
		FROM messages
		WHERE
			room_id = @roomId AND
			dt_sent > @dtFrom
		ORDER BY dt_sent
	`, {
		roomId: SQL.ID(roomId),
		dtFrom: SQL.DT(options.dtFrom || new Date(0))
	})

	return messages.map(([ id, userId, dtSent, content ]) =>
		({ id, userId, dtSent, content })
	)
}
