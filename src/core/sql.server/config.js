const { Config } = App

App.SQL.Config = {
	numConnections: 3,
	reconnectTimeout: 3,
	connectionConfig: {
		authentication: {
			type: 'default',
			options: {
				userName: Config.SQL_USERNAME,
				password: Config.SQL_PASSWORD
			}
		},
		server: Config.SQL_HOST,
		options: {
			database: Config.SQL_DATABASE,
			port: Number(Config.SQL_PORT),
			trustServerCertificate: true
		}
	}
}
