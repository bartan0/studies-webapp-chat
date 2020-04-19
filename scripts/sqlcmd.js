const { spawn } = require('child_process')

const { TARGET } = process.env

const Config = TARGET === 'production'
	? require('../secret/database.json')
	: require('../config.dev.json')


const subprocess = spawn('docker-compose', [
	'--file', 'compose.yml',
	'--project-name', 'webchat',
	'exec', 'database', '/opt/mssql-tools/bin/sqlcmd',
		'-U', Config.SQL_USERNAME,
		'-P', Config.SQL_PASSWORD,
		'-S', Config.SQL_HOST,
		'-d', Config.SQL_DATABASE,
		...process.argv.slice(2)
], {
	stdio: 'inherit'
})
	.on('exit', (code, signal) => {
		if (signal)
			return console.info(`Subprocess killed by signal [${signal}]`)

		if (code)
			console.info(`Subprocess returned [${code}]`)
	})
