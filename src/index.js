const { APP_TYPE = 'server' } = process.env

global.App = {
	services: {},

	registerCoreService (name, service) {
		this[name] = service
	}
	,
	registerService (name, service) {
		this.services[name] = service
	}
}

require('autoloader')(__dirname, {
	tags: [ APP_TYPE ]
})
