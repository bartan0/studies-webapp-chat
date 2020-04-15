const HTTPServer = require('./core/http')
const services = require('./services')

const context = Object.assign({
	HTTPServer
},
	services
)

Object.values(services).forEach(init => init(context))


HTTPServer()
