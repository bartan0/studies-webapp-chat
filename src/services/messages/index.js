const HTTP = require('./http')

function init (context) {
	this.context = context

	context.HTTPServer.addRouters(HTTP(context))
}

Object.assign(init,
	require('./api')
)

module.exports = init
