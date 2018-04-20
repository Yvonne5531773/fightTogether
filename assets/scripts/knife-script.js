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
		console.log('onMouseDown event', event.getLocation())
		console.log('onMouseDown this._self', this._self)
		this._down = true
		this._self.setPosition(event.getLocation())
		// this._self.setPosition(this._mainScript.node.getPosition())
	},

	onMouseMove (event) {
		if(this._down) {
			console.log('onMouseMove event', event.getLocation())
			console.log('onMouseMove this._self', this._self)
			this._self.setPosition(event.getLocation())
			// this._self.setPosition(this._mainScript.node.getPosition())
    }
	},

	onMouseUp (event) {
		console.log('onMouseUp')
    this._down = false
		// this._self.reset()
	},

	// update (dt) {},
});
