const api = require('api'),
	config = require('config')

cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		normalPop: cc.Node,
		lotteryPop: cc.Node,
		giftPop: cc.Node,
		knifePrefab: cc.Prefab,
		timeLabel: cc.Label,
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
		//跳转到结束场景
		cc.director.loadScene("game-end-scene")
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
		let count = time
		this.countdown = function () {
			if (count <= 0) {
				this.endGame()
				this.unschedule(this.countdown, this)
			}
			this.setTimeLabel(count--)
		}
		this.schedule(this.countdown, 1, cc.macro.REPEAT_FOREVER, 0)
	},

	initEndPop () {
		if (!this.dataStore) return
		const gifts = this.dataStore.getGifts() || 0,
			getCoin = this.dataStore.getGetCoin() || 0
		console.log('initEndPop getCoin', getCoin)
		if (gifts > 0) {
			this.lotteryPop.getChildByName('result-txt').getComponent(cc.Label).string = '恭喜你获得'+getCoin+'氪币和'+gifts+'个礼包'
			this.lotteryPop.active = true
		} else {
			// 注册点击事件
			this.node.on("touchstart", this.onTouchStart, this)
			this.normalPop.getChildByName('result-txt').getComponent(cc.Label).string = '恭喜你获得'+getCoin+'氪币'
			this.normalPop.active = true
		}
	},

	getData () {
		const data = this.dataStore? this.dataStore.getdata() : null
		console.log('getData data', data)
		if (!data) return
		data.enemy && this.dataStore.setEnemyId(data.enemy.id)
		return cc.clone(data)
	},

	setTimeLabel (time) {
		this.timeLabel.string = time + 's'
	},

	setEnemy (data) {
		if(!data) return
		const name = this.enemy.getChildByName('name'),
			bar = this.enemy.getChildByName('HP-bar'),
			hp = this.enemy.getChildByName('HP-val'),
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
		this.saveInfo(data).then(res => {
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
		console.log('in saveInfo criteria', criteria)
		return api.fetch(criteria)
	},

	chooseGift (e, eventData) {
		const gift = this._vm.gift[eventData]
		this.lotteryPop.active = false
		this.giftPop.active = true
		this.giftPop.getChildByName('result').getComponent(cc.Label).string = '获得'+gift.name
		// 注册点击事件
		this.node.on("touchstart", this.onTouchStart, this)
		console.log('in chooseGift gift', gift)
	},

});
