App.HTTP.getRouter('/test')
	.get('/env', (req, res) => {
		res.json(process.env)
	})
