const { Request, TYPES } = require('tedious')

App.registerCoreService('SQL', {
	ID: id => [ TYPES.UniqueIdentifier, id ],
	String: s => [ TYPES.NVarChar, s ],
	DT: dt => [ TYPES.DateTimeOffset, dt ],

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

			this.Pool.submit(req)
		})
	}
})
