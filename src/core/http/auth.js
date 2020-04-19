const { HTTP } = App

const authorizeType = {
	Basic (userpass) {
		return Buffer.from(userpass, 'base64').toString().split(':')[0]
	}
	,
	Bearer (token) {
		return token
	}
}


const authorize = req => new Promise((resolve, reject) => {
	const [ type, value ] = (req.headers['authorization'] || '').split(' ')
	const auth = authorizeType[type]

	if (auth)
		return resolve(req.user = {
			id: auth(value || '')
		})

	reject('not-authorized')
})


HTTP.authorizeHTTPRequest = authorize

HTTP.use((req, res, next) =>
	authorize(req)
		.then(user => next())
		.catch(next)
)
