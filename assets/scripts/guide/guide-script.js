const conversations = require('conversation')

cc.Class({
	extends: cc.Component,

	properties: {
    conversation1: cc.Label,
		conversation2: cc.Label,
		conversation3: cc.Label,
		conversation4: cc.Label,
		conversation5: cc.Label,
		conversation6: cc.Label,
		conversation7: cc.Label,
		me1: cc.Label,
		me2: cc.Label,
		me3: cc.Label,
		z0: cc.Label,
		z1: cc.Label,
		z2: cc.Label,
    speed: 0,
    _delay: []
	},

	onLoad () {
    this._delay = [0, .5, 1, 1, 1, 1, 1]
    let i = 0
		this.typing(this.conversation1, conversations.data[i++].txt, this._delay[i], () => {
			this.z0.enabled = true
			this.typing(this.conversation2, conversations.data[i++].txt, this._delay[i], () => {
				this.me1.enabled = true
				this.typing(this.conversation3, conversations.data[i++].txt, this._delay[i], () => {
					this.z1.enabled = true
					this.typing(this.conversation4, conversations.data[i++].txt, this._delay[i], () => {
						this.me2.enabled = true
						this.typing(this.conversation5, conversations.data[i++].txt, this._delay[i], () => {
							this.z2.enabled = true
							this.typing(this.conversation6, conversations.data[i++].txt, this._delay[i], () => {
								this.me3.enabled = true
								this.typing(this.conversation7, conversations.data[i++].txt, this._delay[i], () => {
									console.log('end' + i)
								})
							})
						})
					})
				})
			})
		})
  },

	typing (label, text, delay, cb) {
		let self = this,
      html = '',
      arr = text.split(''),
      len = arr.length,
      step = 0
		self.func = function () {
			html += arr[step]
			label.string = html
			if (++step === len) {
				self.unschedule(self.func, self);
				cb && cb()
			}
		}
		self.schedule(self.func, this.speed, cc.macro.REPEAT_FOREVER, delay)
	}
});
