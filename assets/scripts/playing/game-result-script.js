const api = require('api'),
	config = require('config')

cc.Class({
	extends: cc.Component,

	properties: {
		harm: cc.Node,
		exceed: cc.Node,
		rank: cc.Node,
		enemy: cc.Node,
		hpBar: cc.Node
	},

	// onLoad () {
	// 	const ds = cc.director.getScene().getChildByName('data-store')
	// 	this.dataStore = ds?ds.getComponent('datastore-script'):null
	// 	this.getResult().then(function(res) {
	// 		if (res.code === 0) {
	// 			let data
	// 			res.data && (data = cc.clone(res.data))
	// 			console.log('in getResult data', data)
	// 			this.init(data)
	// 		}
	// 	}.bind(this))
	// },

	init (playScript) {
		console.log('result ,init playScript', playScript)
		const ds = cc.director.getScene().getChildByName('data-store')
		this.dataStore = ds?ds.getComponent('datastore-script'):null
		this.getResult().then(function(res) {
			if (res.code === 0) {
				let data
				res.data && (data = cc.clone(res.data))
				console.log('in getResult data', data)
				if (data.user_rank) {
					const harm = data.user_rank.user_harm,
						exceed = data.user_rank.overplayer,
						rank = data.user_rank.title_rank
					this.initHarm(harm)
					this.initExceed(exceed)
					this.initRank(rank)
				}
				data.enemy && this.initEnemy(data.enemy)
			}
		}.bind(this))
	},

	initHarm (val = 0) {
		this.harm.getComponent(cc.Label).string = Math.floor(val / 10000)
	},

	initExceed (val = 0) {
		this.exceed.getComponent(cc.Label).string = Math.floor(val)
	},

	initRank (val = 0) {
		this.rank.getComponent(cc.Label).string = Math.floor(val)
	},

	initEnemy (enemy) {
		console.log('initEnemy enemy', enemy)
		const enemyShow = enemy.hp===0? this.enemy.getChildByName('death'):this.enemy.getChildByName('normal')
		enemyShow.active = true
		this.initHPBar(this.hpBar, enemy)
		const name = this.hpBar.getChildByName('name'),
			val = this.hpBar.getChildByName('val')
		name.getComponent(cc.Label).string = enemy.name
		val.getComponent(cc.Label).string = Math.floor(enemy.hp/10000)+'HP / ' + Math.floor(enemy.hp_max/10000)+'HP'
	},

	initHPBar (bar, enemy) {
		console.log('initHPBar bar', bar)
		if (!bar) return
		bar.getComponent(cc.ProgressBar).progress = enemy.hp / enemy.hp_max
		const full = bar.getChildByName('full'),
			reduce = bar.getChildByName('reduce')
			progress = bar.getComponent('cc.ProgressBar')
		if (this.enemy.hp_max >= this.enemy.hp) {
			reduce.active = true
			progress.barSprite = reduce
		} else {
			full.active = true
			progress.barSprite = full
		}
		console.log('progress', progress)
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
