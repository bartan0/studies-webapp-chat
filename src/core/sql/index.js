const { Request } = require('tedious')

const Pool = require('./pool')


module.exports = Object.assign(function () {
	Pool({
		numConnections: 3,
		reconnectTimeout: 3,
		connectionConfig: {
			authentication: {
				type: 'default',
				options: {
					userName: 'SA',
					password: 'Dev-Passwd'
				}
			},
			server: 'localhost',
			options: {
				database: 'develop',
				port: 9001,
				trustServerCertificate: true
			}
		}
	})
}, {
	request (sql, params) {
		return new Promise((resolve, reject) => {
			const res = []
			const req = new Request(sql, err => err
				? reject(err)
				: resolve(res)
			)
				.on('row', row => res.push(row.map(({ value }) => value)))

			if (params)
				Object.entries(params).forEach(([ name, [ type, value ] ]) =>
					req.addParameter(name, type, value)
				)

			Pool.submit(req)
		})
	}
})
