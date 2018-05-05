import "babel-polyfill"
const api = require('api'),
	info = require('info'),
	config = require('config')

cc.Class({
	extends: cc.Component,

	properties: {
		_vm: {}
	},

	async onLoad () {
		const res = await this.getInfo()
		if(!res) return
		this._vm = cc.clone(res.data)
		// 存储数据
		this.storeData()
		// 导向场景
		this.toScene()
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
		return await api.fetch(criteria)
	},

	toScene () {
		if(!this._vm.user_game_info) return
		let scene = ''
		if (this._vm.user_game_info.newcoming === 0) {
			// scene = "guide-scene"
			scene = "index-scene"
		}else {
			scene = "index-scene"
		}
		cc.director.loadScene(scene)
	},

	storeData () {
		const node = cc.find('data-store').getComponent('datastore-script')
		node.setdata(this._vm)
	}

});
