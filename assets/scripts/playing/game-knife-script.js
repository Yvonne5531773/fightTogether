import collision from '../utils/collision'

cc.Class({
	extends: cc.Component,

	properties: {
		minDist: 0,
		collOffest: 0,
		actionAudio: '',
		_mainScript: null,
		_self: null,
		_ms: null,
		_mainNodeVec: null,
		_prePosition: null,
		_audioPlayed: null,
	},

	init (mainScript) {
		this._mainScript = mainScript
		// this._self = this._mainScript.node.getChildByName('knife')
		this._self = this._mainScript.knifeCtr.getChildByName('knife')
		this._mainNodeVec = cc.v2(this._mainScript.node.getPosition())
		this._ms = this._self.getComponent('cc.MotionStreak')
		//注册点击事件
		this._mainScript.node.on("touchstart", this.onTouchStart, this)
		this._mainScript.node.on("touchmove", this.onTouchMove, this)
		this._mainScript.node.on("touchend", this.onTouchUp, this)
	},

	onTouchStart (event) {
		this._ms.reset()
		this.setPosition(event.getLocation())
		this._prePosition = event.getLocation()
		this._audioPlayed = false
	},

	onTouchMove (event) {
		this.setPosition(event.getLocation())
		const distance = cc.pDistance(this._prePosition, event.getLocation())
		//划动距离超过预设值
		distance > this.minDist && (this.audioPlay(), this._prePosition = event.getLocation())
		// distance > this.minDist && (this.checkCollision(event.getLocation(), this._prePosition), this._prePosition = event.getLocation())
	},

	onTouchUp (event) {
		this._ms.reset()
	},

	setPosition (position) {
		const pos = cc.v2(position)
		this._ms.node.setPosition(pos)
	},

	checkCollision (now, pre) {
		const enemyPos = cc.v2(this._mainScript.enemy.node.getPosition()),
		// const enemyPos = cc.v2(this._mainScript.enemy.node.getPosition()).add(this._mainNodeVec),
			enemyX = enemyPos.x,
			enemyY = enemyPos.y
		const col = collision.checkCollision(now.x, now.y, pre.x, pre.y, enemyX, enemyY, this.collOffest)
	},

	audioPlay () {
		if(!this._audioPlayed) {
			cc.audioEngine.play(cc.url.raw('resources/' + this.actionAudio), false, .5)
			this._audioPlayed = true
		}
	},
	// update (dt) {},
})