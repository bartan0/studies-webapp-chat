module.exports = function (context) {
	context.HTTPServer.addRouters(
		require('./http')(context)
	)

	return require('./api')(context)
}
