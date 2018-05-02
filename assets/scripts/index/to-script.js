cc.Class({
	extends: cc.Component,

	properties: {
		toast: cc.Node,
		_tips: null
	},

	start () {
		this._tips = ['你的生存能力关系到攻击时间哦！', '你越强，伤害就越高！', '快速滑动屏幕，攻击怪兽！']
	},

	toPlayScene () {
		this.toastShow(0, () => {
			cc.director.loadScene("game-playing-scene")
		})
	},

	toastShow (delay, cb) {
		this.toast.active = true
		let self = this,
			step = 3,
			timeLabel = this.toast.getChildByName('time').getComponent('cc.Label'),
			tipLabel = this.toast.getChildByName('tip').getComponent('cc.Label')
		timeLabel.string = step + ''
		tipLabel.string = this._tips[step-- - 1]
		self.func = function () {
			timeLabel.string = step + ''
			tipLabel.string = this._tips[step - 1]
			if (--step === 0) {
				self.unschedule(self.func, self)
				cb && cb()
			}
		}
		self.schedule(self.func, 1, cc.macro.REPEAT_FOREVER, delay)
	},

	toRankScene () {
		cc.director.loadScene("rank-scene")
	},

});
