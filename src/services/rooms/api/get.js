const {
	SQL,
	services: { Rooms }
} = App

Rooms.get = async function () {
	const rooms = await SQL.request(`
		SELECT id, name FROM rooms
	`)

	return rooms.map(([ id, name ]) => ({ id, name }))
}
