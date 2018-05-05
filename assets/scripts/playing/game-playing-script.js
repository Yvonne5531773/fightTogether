cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		normalPop: cc.Node,
		lotteryPop: cc.Node,
		knifePrefab: cc.Prefab,
		timeLabel: cc.Label,
		knifeScript: '',
		knifeCtr: {
			type: cc.Node,
			default: null
		},
		_vm: null,
		_timeScore: 0,
		_exceedMap: null,
	},

	onLoad () {
		// 获取数据
		this._vm = this.getData()
		// 敌人信息
		this._vm && this.setEnemy(this._vm.enemy)
		// 初始化武器
		this.initKnife(this.knifePrefab)
		// 初始化倒计时
		this.initCountDown(this._timeScore = 200)
		// 开启物理系统
		cc.director.getPhysicsManager().enabled = true
		// 初始化超过人数表
		this.initExcees()
		//加载音乐文件
		// const node = cc.director.getScene().getChildByName('data-store'),
		// 	data = node? node.getComponent('datastore-script').getdata():{},
		// const configUrl = 'config.json'
		// cc.loader.loadRes(configUrl, this.onLoadCompleted.bind(this))
	},

	initKnife (knifePrefab) {
		if(!knifePrefab) return
		const knife = cc.instantiate(knifePrefab)
		this.knifeCtr.addChild(knife)
		knife.getComponent(this.knifeScript).init(this)
	},

	initCountDown (time) {
		this.setTimeLabel(time)
		let count = time
		this.countdown = function () {
			if (count <= 0) {
				this.endGame()
				this.unschedule(this.countdown, this);
			}
			this.setTimeLabel(count--)
		}
		this.schedule(this.countdown, 1, cc.macro.REPEAT_FOREVER, 0)
	},

	initExcees () {
		// 已攻击人数+手速+暴击次数+造成伤害
		// this._exceedMap = new Map([[.02, ], [], [], []])
	},

	getData () {
		const node = cc.director.getScene().getChildByName('data-store')
		if(!node) return
		const data = node.getComponent('datastore-script') && node.getComponent('datastore-script').getdata()
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
		nameStr && (nameStr.string = data.name)
		hpBarVal && (hpBarVal.progress = data.hp/data.hp_max)
		hpVal && (data.hp_max>=data.hp) && (hpVal.string = Math.floor(data.hp/10000)+'HP/' + Math.floor(data.hp_max/10000)+'HP')
	},

	endGame () {
		//停止动画
		this.enemy.getComponent('game-enemy-script').stopAnimate()
		//结束弹框
		console.log('this.normalPop', this.normalPop)
		this.normalPop && (this.normalPop.active = true)
		//刀刃释放
		this.knifeCtr.destroy()
		//注册点击事件
		this.node.on("touchstart", this.onTouchStart, this)
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

});
