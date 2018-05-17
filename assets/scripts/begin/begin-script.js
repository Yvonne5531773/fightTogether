// require("babel-polyfill")
const api = require('api'),
	config = require('config'),
	util = require('utils')

cc.Class({
	extends: cc.Component,

	properties: {
		_vm: null,
	},

	onLoad () {
		const req = this.getRequest()
		this.token = "OJQgKzjBPHEe5BaYQkLOogpm28J13Xbg"
		this._uuid = "test"
		// this.token = req.token
		// this._uuid = req.uuid
		this.getInfo().then(function(res) {
			console.log('in begin getInfo res', res)
			if(!res || !res.data) return
			this._vm = cc.clone(res.data)
			// 存储数据
			this.storeData()
			// 导向场景
			this.toScene()
		}.bind(this))
  },

	getRequest () {
		const request = {}
		request.token = util.request('token')
		request.uuid = util.request('uuid')
		console.log('getRequest request', request)
		return request
	},

	getInfo () {
		const criteria = {
			path: config.infoPath,
			data: {
				token: this.token,
				ts: Date.parse(new Date()),
				uuid: this._uuid
			},
			type: 'POST',
			method: 'http'
		}
		return api.fetch(criteria)
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
		node.setToken(this.token)
		node.setUuid(this._uuid)
	}

});
