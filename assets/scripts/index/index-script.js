// import api from '../../resources/javascripts/api'
const api = require('api')

cc.Class({
	extends: cc.Component,

	properties: {

	},

	onLoad () {
		// const url = 'song.json'
		// this._current = 0
		// cc.loader.loadRes(url, this.onCompleted.bind(this))
		console.log('index onLoad')
		const criteria = {
			path: '/v1/user/info',
			data: {
				"token": "RlIzRIZXE3dQ6UxY0qvsiBFiROh97n95",
				"ts": Date.parse(new Date()),
				"uuid": "test"
			},
			type: 'POST',
			method: 'fetch'
		}
		const res = api.fetch(criteria).then(res => {
			console.log('onLoad res', res)
		})
	},

	onCompleted (err, res) {
		// if(err) return
		// const data = res.data,
		// 	node = cc.find('data-store').getComponent('datastore-script')
		// node.setdata(data[0])
	},

});
