App.registerService('Messages', {
	create ({
		userId,
		roomId,
		content
	}) {
		console.log('Create message', {
			userId,
			roomId,
			content
		})

		return new Promise(r => r('example-message'))
	}
})
