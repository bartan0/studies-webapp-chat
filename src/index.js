global.App = {
	Type: process.env.APP_TYPE || (() => { throw 'APP_TYPE must be specified' })(),
	package: require('package.json'),
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
	tags: [ App.Type ]
})
