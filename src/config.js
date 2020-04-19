App.Env = process.env
App.Config = App.Env.NODE_ENV === 'production'
	? require('config.prod.json')
	: require('config.dev.json')

Object.keys(App.Config).forEach(key => {
	const v = App.Env[key]

	if (v !== undefined)
		App.Config[key] = v
})
