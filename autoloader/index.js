const fs = require('fs')
const path = require('path')

const Config = {
	extensions: [ 'js' ],
	tagDisabled: 'x',
	tags: []
}

const callbacks = []


const isNotHidden = file => !file.name.startsWith('.')

const getOrder = stem => {
	if (stem === 'index')
		return 0

	if (stem === 'lib')
		return 10

	if (stem === 'test')
		return 1000

	return 100
}

const processTags = entry => {
	const tags = new Set

	entry.tags.forEach(tag => {
		const order = +tag

		if (order > 0)
			entry.order += order

		else if (tag === Config.tagDisabled)
			entry.type = null

		else
			tags.add(tag)
	})

	if (Config.tags.length && tags.size && !Config.tags.some(tag => tags.has(tag)))
		entry.type = null

	return entry
}


const getPathsTree = dirpath => new Promise((resolve, reject) =>
	fs.readdir(dirpath, { withFileTypes: true }, (err, files) => err
		? reject(err)
		: resolve(files
			.filter(isNotHidden)
			.map(file => {
				const type = file.isFile() ? 'file' : file.isDirectory() ? 'dir' : null
				const parts = file.name.split('.')
				const ext = type === 'file' ? parts.slice(-1)[0] : null

				return {
					file,
					type: type !== 'file' || Config.extensions.includes(ext)
						? type
						: null,
					stem: parts[0],
					order: getOrder(parts[0]),
					tags: parts.slice(1, type === 'file' ? -1 : undefined),
					ext
				}
			})
			.map(processTags)
			.filter(({ type }) => type)
			.sort((e1, e2) => {
				const d = e1.order - e2.order

				return d ? d : e1.stem === e2.stem ? 0
					: e1.stem < e2.stem ? -1 : 1
			})
			.map(({ file: { name }, type }) => type === 'file'
				? path.resolve(dirpath, name)
				: getPathsTree(path.resolve(dirpath, name))
			)
		)
	)
)


const loadModules = async pathsTree => {
	for (const elem of await pathsTree)
		if (typeof elem === 'string') {
			const res = require(elem)

			if (typeof res === 'function')
				callbacks.push(res)

		} else
			await loadModules(elem)
}


module.exports = (rootpath, config) => {
	Object.assign(Config, config)

	loadModules(getPathsTree(rootpath))
		.then(() => callbacks.forEach(cb => cb()))
}
