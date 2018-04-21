cc.Class({
	extends: cc.Component,

	properties: {
		_mainScript: null,
		_self: null,
		_ms: null,
		_mainNodeVec: null,
	},

	init (mainScript) {
		this._mainScript = mainScript
		this._self = this._mainScript.movePanel.getChildByName('knife')
		// this._self = this._mainScript.node.getChildByName('knife')
		this._mainNodeVec = cc.v2(this._mainScript.node.getPosition())
		this._ms = this._self.getComponent('cc.MotionStreak')
		this._mainScript.node.on("touchstart", this.onTouchStart, this)
		this._mainScript.node.on("touchmove", this.onTouchMove, this)
		this._mainScript.node.on("touchend", this.onTouchUp, this)
	},

	onTouchStart (event) {
		this._ms.reset()
		this.setPosition(event.getLocation())
	},

	onTouchMove (event) {
		this.setPosition(event.getLocation())
	},

	setPosition (position) {
		const pos = cc.v2(position)
		// const pos = cc.v2(position).sub(this._mainNodeVec)
		this._ms.node.setPosition(pos)
	},

	onTouchUp (event) {
		this._ms.reset()
	},

	// update (dt) {},
})