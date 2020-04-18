module.exports = context => ({
	messages: require('./messages')(context),
	rooms: require('./rooms')(context)
})
