const api = require('api'),
	config = require('config'),
	Result = require('game-result-script')

cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		popup: cc.Node,
		lotteryPop: cc.Node,
		coinPop: cc.Node,
		knifePrefab: cc.Prefab,
		countDown: cc.Node,
		secondLabel: cc.Label,
		milliSecondLabel: cc.Label,
		result: Result,
		knifeScript: '',
		knifeCtr: {
			type: cc.Node,
			default: null
		},
		_vm: null,
		_timeScore: 0,
		_boomCount: 0,
	},

	onLoad () {
		// 获取数据
		const ds = cc.director.getScene().getChildByName('data-store')
		this.dataStore = ds?ds.getComponent('datastore-script'):null
		this._vm = this.getData()
		// 敌人信息
		this._vm && this.setEnemy(this._vm)
		// 初始化武器
		this.initKnife(this.knifePrefab)
		// 初始化倒计时
		this.initCountDown(this._timeScore = 3)
		// 开启物理系统
		cc.director.getPhysicsManager().enabled = true
		// 加载音乐文件
		// const node = cc.director.getScene().getChildByName('data-store'),
		// 	data = node? node.getComponent('datastore-script').getdata():{},
		// const configUrl = 'config.json'
		// cc.loader.loadRes(configUrl, this.onLoadCompleted.bind(this))
	},

	onTouchStart (e) {
		e.stopPropagation()
		this.node.off("touchstart", this.onTouchStart, this)
		// 弹出结束结果框
		// cc.director.loadScene("game-end-scene")
		this.popup.getChildByName('end').active = false
		this.popup.getChildByName('result').active = true
		console.log('onTouchStart result', this.result)
		this.result.init(this)
	},

	onLoadCompleted (err, res) {
		if(err) {
			console.log('error: ', err)
			return
		}
		console.log('onLoadCompleted res', res)
	},

	initKnife (knifePrefab) {
		if(!knifePrefab) return
		const knife = cc.instantiate(knifePrefab)
		this.knifeCtr.addChild(knife)
		knife.getComponent(this.knifeScript).init(this)
	},

	initCountDown (time) {
		this.setTimeLabel(time)
		this.dataStore && this.dataStore.setTime(time)
		let count = time* 100
		const countdown = setInterval(function () {
			count--
			const ss = Math.floor(count/ 100),
				ms = count - Math.floor(count/ 100)* 100
			if (count <= 0) {
				this.endGame()
				clearInterval(countdown)
			}
			this.setTimeLabel(ss, ms)
		}.bind(this), 10)
	},

	initEndPop () {
		this.popup.active = true
		if (!this.dataStore) return
		const gifts = this.dataStore.getGifts() || 0,
			getCoin = this.dataStore.getGetCoin() || 0
		console.log('initEndPop getCoin', getCoin)
		if (gifts > 0) {
			const frame = this.lotteryPop.getChildByName('frame'),
				coin = frame.getChildByName('result-coin').getComponent(cc.Label),
				gift = frame.getChildByName('result-gift').getComponent(cc.Label)
			coin.string = getCoin+''
			gift.string = gifts+''
			this.lotteryPop.active = true
		} else {
			// 注册点击事件
			const frame = this.coinPop.getChildByName('frame')
			this.node.on("touchstart", this.onTouchStart, this)
			console.log('initEndPop frame getChildByName(\'result-coin\')', frame.getChildByName('result-coin'))
			frame.getChildByName('result-coin').getComponent(cc.Label).string = getCoin+''
			this.coinPop.active = true
		}
	},

	getData () {
		const data = this.dataStore? this.dataStore.getdata() : null
		console.log('getData data', data)
		if (!data) return
		data.enemy && this.dataStore.setEnemyId(data.enemy.id)
		return cc.clone(data)
	},

	setTimeLabel (ss='00', ms='00') {
		this.secondLabel.string = Math.floor(ss/10)<=0? '0'+ss : ''+ss
		this.milliSecondLabel.string = Math.floor(ms/10)<=0? '0'+ms : ''+ms
		// let count = 100
		// this.func = function () {
		// 	this.milliSecondLabel.string = --count+''
		// 	count === 0 && this.unschedule(this.func, this)
		// }
		// this.schedule(this.func, 0.01, cc.macro.REPEAT_FOREVER, 0)
	},

	setEnemy (data) {
		if(!data) return
		const bar = this.enemy.getChildByName('head').getChildByName('HP-bar'),
			hp = bar.getChildByName('HP-val'),
			name = bar.getChildByName('name'),
			nameStr = name? name.getComponent('cc.Label') : null,
			hpBarVal = bar? bar.getComponent('cc.ProgressBar') : null,
			hpVal = hp? hp.getComponent('cc.Label') : null
		nameStr && (nameStr.string = data.enemy.name)
		hpBarVal && (hpBarVal.progress = data.enemy.hp/data.enemy.hp_max)
		hpVal && (data.enemy.hp_max>=data.enemy.hp) && (hpVal.string = Math.floor(data.enemy.hp/10000)+'HP/' + Math.floor(data.enemy.hp_max/10000)+'HP')
		const enemy = this.enemy.getComponent('game-enemy-script')
		enemy.setAttackNum(data.enemy.attack_user_num)
		enemy.setPlayerAck(data.user_attrs.ack)
		enemy.setHP(data.enemy.hp)
		enemy.setHPMax(data.enemy.hp_max)
		enemy.setBoom(data.user_attrs.boom / 10000)
		this.setHPBar(bar, data.enemy)
	},

	setHPBar (bar, enemy) {
		if (!bar) return
		console.log('in setHPBar enemy', enemy)
		const full = bar.getChildByName('full'),
			reduce = bar.getChildByName('reduce'),
			progress = bar.getComponent('cc.ProgressBar')
		if (enemy.hp_max >= enemy.hp) {
			reduce.active = true
			progress.barSprite = reduce
		} else {
			full.active = true
			progress.barSprite = full
		}
	},

	endGame () {
		// 停止动画
		this.enemy.getComponent('game-enemy-script').stopAnimate()
		// 结束弹框
		this.initEndPop()
		// 刀刃释放
		this.knifeCtr.destroy()
		// saveInfo上报数据
		this.save()
		// 销毁倒计时
		this.countDown && this.countDown.destroy()
		// 销毁血条
		this.enemy.getChildByName('head').destroy()
	},

	save () {
		const dataStore = this.dataStore
		if (!dataStore) return
		const	data = {
				token: dataStore.getToken(),
				enemyId: dataStore.getEnemyId(),
				harm: parseInt(dataStore.getHarm()),
				time: dataStore.getTime(),
				strokes: dataStore.getStrokes(),
				use_coin: dataStore.getUseCoin(),
				get_coin: dataStore.getGetCoin(),
				buy_id: dataStore.getBuyId(),
				gain: {
					boom: parseInt(dataStore.getGainBoom()* 10000),
				},
				ts: Date.parse(new Date()),
				uuid: dataStore.getUuid()
			}
		console.log('save data', data)
		dataStore.setSaveInfo(data)
		this.saveInfo(data).then(function(res) {
			console.log('saveinfo res', res)
		})
	},

	saveInfo (data) {
		const criteria = {
			path: config.saveInfoPath,
			data: data,
			type: 'POST',
			method: 'http'
		}
		return api.fetch(criteria)
	},

	chooseGift (e, eventData) {
		const gift = this._vm.gift[eventData],
			dataStore = this.dataStore,
			cases = this.lotteryPop.getChildByName('cases'),
			choosed = this.lotteryPop.getChildByName('choose-gift'),
			tip1 = this.lotteryPop.getChildByName('tip1'),
			tip2 = this.lotteryPop.getChildByName('tip2'),
			name = this.lotteryPop.getChildByName('frame').getChildByName('name'),
			giftSprite = choosed.getChildByName('gift').getComponent(cc.Sprite)
		cases.active = false
		choosed.active = true
		tip1.active = false
		tip2.active = true
		name.getComponent(cc.Label).string = gift.name+'！'
		console.log('chooseGift gift', gift)
		cc.loader.load(gift.pic, function(err, texture) {
			console.log('chooseGift texture', texture)
			giftSprite.setTexture(texture)
		})
		// 注册点击事件
		this.node.on("touchstart", this.onTouchStart, this)
		console.log('in chooseGift gift', gift)
		const data = {
			token: dataStore.getToken(),
			id: gift.id,
			ts: Date.parse(new Date()),
			uuid: dataStore.getUuid()
		}
		this.pickgift(data).then(function(res) {
			console.log('pickgift res', res)
		})
	},

	pickgift (data) {
		const criteria = {
			path: config.pickgiftPath,
			data: data,
			type: 'POST',
			method: 'http'
		}
		console.log('in saveInfo criteria', criteria)
		return api.fetch(criteria)
	},
});
