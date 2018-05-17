const tips = require('tip'),
	util = require('utils')

cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		toast: cc.Node,
		consumeCoinNum: 0,
		_vm: null,
		_tips: null,
		_showNum: 0,
		_consumed: null,
	},

	onLoad () {
		this.initTips()
		this._vm = this.getData()
		console.log('index onLoad this._vm', this._vm)
		this._vm && this.setEnemy(this._vm.enemy)
	},

	getData () {
		const node = cc.director.getScene().getChildByName('data-store')
		console.log('getData node', node)
		if(!node) return
		const data = node.getComponent('datastore-script') && node.getComponent('datastore-script').getdata()
		return cc.clone(data)
	},

	initTips () {
		this._tips = []
		this._showNum = 3
		for (let i = 0; i < this._showNum; i++) {
			const tip = tips.data[Math.floor(Math.random()*tips.data.length)]
			if (~this._tips.indexOf(tip)) {
				i--
			} else {
				this._tips.push(tip)
			}
		}
		console.log('this._tips', this._tips)
	},

	setEnemy (data) {
		if(!data) return
		const name = this.enemy.getChildByName('name'),
			bar = this.enemy.getChildByName('HP-bar'),
			hp = this.enemy.getChildByName('HP-val'),
			attack = this.enemy.getChildByName('attack-num'),
			nameStr = name? name.getComponent('cc.Label') : null,
			hpBarVal = bar? bar.getComponent('cc.ProgressBar') : null,
			hpVal = hp? hp.getComponent('cc.Label') : null,
			attackNum = attack? attack.getComponent('cc.Label') : null
		nameStr && (nameStr.string = data.name)
		hpBarVal && (hpBarVal.progress = data.hp/data.hp_max)
		hpVal && (data.hp_max>=data.hp) && (hpVal.string = Math.floor(data.hp/10000)+'HP/' + Math.floor(data.hp_max/10000)+'HP')
		attackNum && (data.attack_user_num = data.attack_user_num>=0?data.attack_user_num:0) && (attackNum.string = '该怪兽已被'+Math.floor(data.attack_user_num)+'人攻击')
	},

	toPlayScene () {
		this.toastShow(0, function()  {
			cc.director.loadScene("game-playing-scene")
		})
	},

	toRankScene () {
		cc.director.loadScene("rank-scene")
	},

	toastShow (delay, cb) {
		this.toast.active = true
		let self = this,
			step = this._showNum,
			timeLabel = this.toast.getChildByName('time').getComponent('cc.Label'),
			tipLabel = this.toast.getChildByName('tip').getComponent('cc.Label')
		timeLabel.string = step + ''
		tipLabel.string = this._tips[step-- - 1]
		self.func = function () {
			timeLabel.string = step + ''
			tipLabel.string = this._tips[step - 1]
			if (--step === 0) {
				self.unschedule(self.func, self)
				cb && cb()
			}
		}
		self.schedule(self.func, 1, cc.macro.REPEAT_FOREVER, delay)
	},

	consumeCoin () {
		const node = cc.director.getScene().getChildByName('data-store'),
			coin = this._vm.user_attrs.coin
		if(!node || this._consumed || coin<this.consumeCoinNum) return
		console.log('in consumeCoin this._vm', this._vm)
		const dataStore = node.getComponent('datastore-script')
		dataStore.setUseCoin(this.consumeCoinNum)
		// 目前只有id=1的消耗品表,且没有获取的api
		dataStore.setBuyId(1)
		// const randomNumBoth = (Min, Max) => {
		// 	let Range = Max - Min,
		// 		Rand = Math.random()
		// 	return Min + Math.round(Rand * Range)
		// }
		const gainBoom = util.randomNumBoth(5, 50)
		// 提升暴击率
		dataStore.setGainBoom(gainBoom / 100)
		this._consumed = true
	}

});
