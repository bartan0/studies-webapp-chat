const { HTTP } = App

HTTP.use((req, res, next) =>
	HTTP.authorizeHTTPRequest(req).then(next, next)
)
