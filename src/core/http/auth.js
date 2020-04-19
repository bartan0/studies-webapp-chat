const jwt = require('jsonwebtoken')

const { Config, HTTP } = App


const authorizeType = {
	Bearer (token, cb) {
		jwt.verify(token, Config.JWT_SECRET, (err, payload) => err
			? cb(err)
			: cb(null, {
				id: payload.userId
			})
		)
	}
}


const authorize = req => new Promise((resolve, reject) => {
	const [ type, value ] = (req.headers['authorization'] || '').split(' ')
	const auth = authorizeType[type]

	if (!auth)
		reject('not-authorized')

	auth(value || '', (err, user) => err
		? reject('not-authorized')
		: resolve(req.user = user)
	)
})


HTTP.authorizeHTTPRequest = authorize

HTTP.use((req, res, next) =>
	authorize(req)
		.then(user => next())
		.catch(next)
)
