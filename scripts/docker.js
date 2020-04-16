const { spawn } = require('child_process')

const subprocess = spawn('docker-compose', [
	'--file', 'compose.yml',
	'--project-name', 'webchat',
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
