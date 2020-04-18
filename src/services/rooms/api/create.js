const { SQLID, SQLString } = require('lib')


module.exports = context =>
	async function (name, {
		membersIds
	}) {
		if (!name.length)
			throw 'name-length-zero'

		if (!membersIds.length)
			throw 'no-members'

		const [ [ roomId ] ] = await context.SQLClient.request(`
			INSERT INTO rooms(name) OUTPUT INSERTED.id VALUES (@name)
		`, {
			name: SQLString(name)
		})

		await Promise.all(membersIds.map(memberId => context.SQLClient.request(`
			INSERT INTO rooms_members(roomId, userId) VALUES (@roomId, @userId)
		`, {
			roomId: SQLID(roomId),
			userId: SQLID(memberId)
		})))

		return roomId
	}
