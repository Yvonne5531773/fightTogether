import "babel-polyfill"
const api = require('api'),
	info = require('info'),
	config = require('config')

cc.Class({
	extends: cc.Component,

	properties: {

	},

	onLoad () {
		this.getInfo()
		// if (info.data && info.data.user_game_info.newcoming === 0) {
		// 	cc.director.loadScene("guide-scene")
		// }else {
		// 	cc.director.loadScene("index-scene")
		// }
  },

	async getInfo () {
		const criteria = {
			path: config.infoPath,
			data: {
				"token": "CpOvzPnX8NkOfvqICnbdJoGgmRERvowa",
				"ts": Date.parse(new Date()),
				"uuid": "test"
			},
			type: 'POST',
			method: 'fetch'
		}
		const res = await api.fetch(criteria)
		console.log('onLoad res', res)
	}

});
