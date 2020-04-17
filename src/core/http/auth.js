const { authorizeHTTPRequest } = require('lib')


module.exports = () => (req, res, next) => {
	authorizeHTTPRequest(req)
		.then(next)
		.catch(next)
}
