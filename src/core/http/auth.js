module.exports = () => (req, res, next) => {
	req.user = {
		id: 'example-user-id'
	}

	next()
}
