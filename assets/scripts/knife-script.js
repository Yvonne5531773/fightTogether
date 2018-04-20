cc.Class({
	extends: cc.Component,

	properties: {
		_mainScript: null,
		_self: null,
		_down: false,
	},

	// onLoad () {},

	init (mainScript) {
		this._mainScript = mainScript
		// const knife = this._mainScript.movePanel.getChildByName('knife')
		const knife = this._mainScript.node.getChildByName('knife')
		this._self = knife
		console.log('in knife init knife', knife)
		this._mainScript.node.on("mousedown", this.onMouseDown, this)
		this._mainScript.node.on("mousemove", this.onMouseMove, this)
		this._mainScript.node.on("mouseup", this.onMouseUp, this)
	},

	onMouseDown (event) {
		console.log('onMouseDown event', event.target.x)
		console.log('onMouseDown event.getLocation()', event.getLocation())
		this._down = true
		// this._self.setPosition(new cc.Vec2(event.target.x, event.target.y))
		this._self.setPosition(event.getLocation())
	},

	onMouseMove (event) {
		if(this._down) {
			console.log('onMouseMove event', event.target.x)
			console.log('onMouseMove event.getLocation()', event.getLocation())
			// this._self.setPosition(new cc.Vec2(event.target.x, event.target.y))
			this._self.setPosition(event.getLocation())
    }
	},

	onMouseUp (event) {
		console.log('onMouseUp')
    this._down = false
		// this._self.reset()
	},

	// update (dt) {},
});
