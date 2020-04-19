const {
	SQL,
	services: { Rooms }
} = App

Rooms.exists = async function (roomId) {
	const [ [ exists ] ] = await SQL.request(`
		SELECT count(*) FROM rooms
		WHERE rooms.id = @roomId
	`, {
		roomId: SQL.ID(roomId)
	})

	return Boolean(exists)
}
