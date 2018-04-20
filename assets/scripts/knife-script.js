cc.Class({
	extends: cc.Component,

	properties: {
		// fadeTime: 0,
		// minSeg: 0,
		// stroke: 0,
		bullet: cc.Prefab,
		_mainScript: null,
		_down: false,
		_ms: null
	},

	// onLoad () {},

	init (mainScript) {
		this._mainScript = mainScript
		this.bullet.addComponent(this.getComponent('cc.MotionStreak'))
		console.log('in knife init')
		this._mainScript.node.on("mousedown", this.onMouseDown, this)
		this._mainScript.node.on("mousemove", this.onMouseMove, this)
		this._mainScript.node.on("mouseup", this.onMouseUp, this)
	},

	onMouseDown (event) {
		console.log('onMouseDown this._ms', this._ms)
		// const ms = this.getComponent('cc.MotionStreak')
		this._down = true
		this.bullet.setPosition(this.node.getPosition())
		// this._ms.setPosition(this._ms.getPosition())
	},

	onMouseMove (event) {
		if(this._down) {
			console.log('onMouseMove')
			this.bullet.setPosition(this.node.getPosition())
			// this._ms.setPosition(this._ms.getPosition())
    }
	},

	onMouseUp (event) {
		console.log('onMouseUp')
    this._down = false
	},

	// update (dt) {},
});
