const { SQL } = App

App.registerService('Rooms', {
	async create (name, {
		membersIds
	}) {
		if (!name.length)
			throw 'name-length-zero'

		if (!membersIds.length)
			throw 'no-members'

		const [ [ roomId ] ] = await SQL.request(`
			INSERT INTO rooms(name) OUTPUT INSERTED.id VALUES (@name)
		`, {
			name: SQL.String(name)
		})

		await Promise.all(membersIds.map(memberId => SQL.request(`
			INSERT INTO rooms_members(roomId, userId) VALUES (@roomId, @userId)
		`, {
			roomId: SQL.ID(roomId),
			userId: SQL.ID(memberId)
		})))

		return roomId
	}
})
