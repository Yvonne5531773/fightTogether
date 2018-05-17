const api = require('api'),
	config = require('config')

cc.Class({
	extends: cc.Component,

	properties: {
		harm: cc.Node,
		exceed: cc.Node,
		rank: cc.Node,
		enemy: cc.Node,
		attacker: cc.Node,
	},

	onLoad () {
		const ds = cc.director.getScene().getChildByName('data-store')
		this.dataStore = ds?ds.getComponent('datastore-script'):null
		this.getResult().then(function(res) {
			if (res.code === 0) {
				let data
				res.data && (data = cc.clone(res.data))
				console.log('in getResult data', data)
				this.init(data)
			}
		}.bind(this))
	},

	init (data) {
		if (!data) return
		if (data.user_rank) {
			const harm = data.user_rank.user_harm,
				exceed = data.user_rank.overplayer,
				rank = data.user_rank.title_rank
			this.initHarm(harm)
			this.initExceed(exceed)
			this.initRank(rank)
		}
		data.enemy && this.initEnemy(data.enemy)
	},

	initHarm (val = 0) {
		this.harm.getComponent(cc.Label).string = '造成伤害' + Math.floor(val / 10000)
	},

	initExceed (val = 0) {
		this.exceed.getComponent(cc.Label).string = '超过' + Math.floor(val) + '人'
	},

	initRank (val = 0) {
		this.rank.getComponent(cc.Label).string = '当前排名' + Math.floor(val)
	},

	initEnemy (enemy) {
		const hpBar = this.enemy.getChildByName('hp-bar')
		console.log('enemy.hp / enemy.hp_max', enemy.hp / enemy.hp_max)
		hpBar.getComponent(cc.ProgressBar).progress = enemy.hp / enemy.hp_max
	},

	getResult () {
		console.log('config.resultPath', config.resultPath)
		const criteria = {
			path: config.resultPath,
			data: {
				token: "OJQgKzjBPHEe5BaYQkLOogpm28J13Xbg",
				// token: this.dataStore.getToken(),
				ts: Date.parse(new Date()),
				// uuid: this.dataStore.getUuid()
				uuid: "test"
			},
			type: 'POST',
			method: 'http'
		}
		return api.fetch(criteria)
	},

	toScene () {
		cc.director.loadScene("rank-scene")
	},

});
