cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		harmNum: {
			default: null,
			type: cc.Prefab
		},
		harmLabel: cc.Label,
		exceedLabel: cc.Label,
		timeLabel: cc.Label,
		progressBar: cc.Node,
		_attack: 0,
		_HP: 0,
		_harm: 0,
		_gameEnd: null
	},

	onLoad () {
		this.setHarmLabel(this._harmScore)
		this.setExceedLabel(this._exceedScore)
		this.initCountDown(this._timeScore = 20)
		this._attack = this.getAttack()
		this._HP = this.getHP()
		this._gameEnd = false
	},

	onEnable () {
		cc.director.getCollisionManager().enabled = true;
	},

	onDisable () {
		cc.director.getCollisionManager().enabled = false;
	},

	onCollisionEnter (other, self) {
		if (self.tag === 1) {
			const HP = this.enemy.getComponent("game-enemy-script").getHP()
			console.log('onCollisionEnter HP', HP)
			//显示伤害值
			this.showHarmNum(this.harmNum)
			//血条减少
			this._HP -= this._attack* .001
			this.setHP(this._HP)
			//造成伤害
			this._harm += this._attack
			this.setHarmLabel(this._harm)
		}
	},

	setHarmLabel (num) {
		if(!num) return
		this.harmLabel.string = '造成伤害' + Math.floor(num)
	},

	setExceedLabel (num) {
		if(!num) return
		this.exceedLabel.string = '已超过' + Math.floor(num) + '名超人'
	},

	initCountDown (time) {
		this.setTimeLabel(time)
		let count = time
		this._timeSI = setInterval( () => {
			count <= 0 && (clearInterval(this._timeSI), this._gameEnd = true)
			this.setTimeLabel(count--)
		}, 1000)
	},

	setTimeLabel (time) {
		this.timeLabel.string = time + 's'
	},

	showHarmNum (harm) {
		if(!harm) return
		const harmNum = cc.instantiate(harm)
		this.enemy.addChild(harmNum)
		harmNum.setPosition(cc.v2(this.enemy.getPosition()))
		const fadeIn = cc.fadeIn(.6).easing(cc.easeCubicActionIn()),
			scale = cc.scaleBy(.8, .8).easing(cc.easeCubicActionOut()),
			moveUp = cc.moveBy(.3, cc.p(0, 200)),
			fadeOut = cc.fadeOut(.6).easing(cc.easeCubicActionOut()),
			sequences = [moveUp, fadeOut]
		harmNum.runAction(cc.sequence(...sequences, cc.callFunc(function() {
			harmNum.destroy()
		}, this)))
		console.log('in showHarmNum harmNum', harmNum)
	},

	getAttack () {
		const attack = 1
		return attack
	},

	getHP () {
		const progressBar = this.progressBar.getComponent('cc.ProgressBar')
		return progressBar.progress
	},

	setHP (val) {
		const progressBar = this.progressBar.getComponent('cc.ProgressBar')
		progressBar.progress = val
	},

	// update (dt) {
	// 	if(this._gameEnd) {
	// 		console.log('game end')
	// 	}
	// }

});
