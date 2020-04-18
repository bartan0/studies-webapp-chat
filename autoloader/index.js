const fs = require('fs')
const path = require('path')

const Config = {
	extensions: [ 'js' ]
}


const isNotHidden = file => !file.name.startsWith('.')

const getOrder = stem => {
	if (stem === 'index')
		return 0

	if (stem === 'lib')
		return 1

	if (stem === 'test')
		return 3

	return 2
}

const checkTags = tags => true


const getPathsTree = dirpath => new Promise((resolve, reject) =>
	fs.readdir(dirpath, { withFileTypes: true }, (err, files) => err
		? reject(err)
		: resolve(files
			.filter(isNotHidden)
			.map(file => {
				const type = file.isFile() ? 'file' : file.isDirectory() ? 'dir' : null
				const parts = file.name.split('.')

				return {
					file,
					type,
					stem: parts[0],
					order: getOrder(parts[0]),
					tags: parts.slice(1, type === 'file' ? -1 : undefined),
					ext: type === 'file' ? parts.slice(-1)[0] : null
				}
			})
			.filter(({ type, ext, tags }) =>
				type &&
				(type !== 'file' || Config.extensions.includes(ext)) &&
				checkTags(tags)
			)
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
		if (typeof elem === 'string')
			require(elem)
		else
			await loadModules(elem)
}


module.exports = (rootpath, config) => {
	Object.assign(Config, config)

	loadModules(getPathsTree(rootpath))
}
