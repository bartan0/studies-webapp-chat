const authorizeBasic = value => Buffer.from(value, 'base64').toString().split(':')[0]


module.exports = {
	authorizeHTTPRequest: req => new Promise((resolve, reject) => {
		const [ type, value ] = (req.headers['authorization'] || '').split(' ')

		if (type === 'Basic') {
			req.user = {
				id: authorizeBasic(value || '')
			}

			return resolve()
		}

		reject('not-authorized')
	})
}
