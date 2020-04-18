module.exports = context => (req, res) => {
	const {
		params: { name },
		body: { membersIds }
	} = req

	context.rooms.create(name, {
		membersIds
	})
		.then(roomId => res.json({ roomId }))
}
