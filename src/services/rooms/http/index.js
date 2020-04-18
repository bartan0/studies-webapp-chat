module.exports = context => [
	[ '/room', require('./room') ],
	// [ '/rooms', require('./rooms') ]
]
	.map(([ path, router ]) => ({ path, router: router(context) }))
