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
		_timeScore: 0,
		_timeSI: null,
	},

	onLoad () {
		console.log('in play load')
		this.initKnife(this.knifePrefab)
		//初始化倒计时
		this.initCountDown(this._timeScore = 200)
		//加载音乐文件
		// const node = cc.director.getScene().getChildByName('data-store'),
		// 	data = node? node.getComponent('datastore-script').getdata():{},
		// const configUrl = 'config.json'
		// cc.loader.loadRes(configUrl, this.onLoadCompleted.bind(this))

		//开启物理系统
		cc.director.getPhysicsManager().enabled = true
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
		let count = time
		this._timeSI = setInterval( () => {
			count <= 0 && (clearInterval(this._timeSI), this.endGame())
			this.setTimeLabel(count--)
		}, 1000)
	},

	setTimeLabel (time) {
		this.timeLabel.string = time + 's'
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

	restart () {
		cc.director.loadScene("main-scene")
	},

});
