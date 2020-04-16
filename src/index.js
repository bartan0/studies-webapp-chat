const HTTPServer = require('./core/http')
const SQLClient = require('./core/sql')

const services = require('./services')

const context = Object.assign({
	HTTPServer,
	SQLClient
},
	services
)

Object.values(services).forEach(init => init(context))


HTTPServer()
SQLClient()
