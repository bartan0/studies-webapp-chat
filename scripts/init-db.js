const { Connection, Request } = require('tedious')

const { TARGET } = process.env
const Config = TARGET === 'production'
	? require('../secret/database.json')
	: require('../config.dev.json')


const sqlMaybeCreateDB = name => `
	IF '${name}' NOT IN (SELECT name FROM sys.databases)
	BEGIN
		CREATE DATABASE ${name}
	END
`

const sqlIfNoTable = (name, sql) => `
	IF '${name}' NOT IN (SELECT name FROM sys.tables)
	BEGIN
		${sql}
	END
`

const sqlCreateTables = [ [
	'rooms', `
		id UNIQUEIDENTIFIER DEFAULT NEWID(),
		name NVARCHAR(40)
	`
], [
	'messages', `
		id UNIQUEIDENTIFIER DEFAULT NEWID(),
		room_id UNIQUEIDENTIFIER,
		user_id UNIQUEIDENTIFIER,
		dt_sent DATETIMEOFFSET,
		content NVARCHAR(256)
	`
], [
	'rooms_members', `
		room_id UNIQUEIDENTIFIER,
		user_id UNIQUEIDENTIFIER
	`
], [
	'users', `
		id UNIQUEIDENTIFIER,
		username NVARCHAR(40)
	`
] ]
	.map(([ name, spec ]) => sqlIfNoTable(name, `
		CREATE TABLE ${name} (${spec})
	`))
	.join('\n')


const error = err => {
	console.error(err.toString())
	process.exit(1)
}


const conn = new Connection({
	authentication: {
		type: 'default',
		options: {
			userName: Config.SQL_USERNAME,
			password: Config.SQL_PASSWORD
		}
	},
	server: Config.SQL_HOST,
	options: {
		database: TARGET && Config.SQL_DATABASE,
		port: Config.SQL_PORT && Number(Config.SQL_PORT),
		trustServerCertificate: true
	}
})


const exec = (msg, sql) => new Promise((resolve, reject) => {
	console.info(msg)

	conn.execSql(new Request(sql, err => {
		if (err)
			return reject(err)

		console.info('Done')
		resolve()
	})
		.on('error', reject)
	)
})


conn
	.on('connect', async err => {
		if (err)
			error(err)

		try {
			if (!TARGET) {
				await exec('Initializing database...', sqlMaybeCreateDB(Config.SQL_DATABASE))
				await exec('Changing database...', `USE ${Config.SQL_DATABASE}`)
			}

			await exec('Initializing tables...', sqlCreateTables)

		} catch (err) {
			error(err)

		} finally {
			conn.close()
		}
	})
	.on('error', error)
