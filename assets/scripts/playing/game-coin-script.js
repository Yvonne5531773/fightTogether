cc.Class({
	extends: cc.Component,

	properties: {
		coinAudio: '',
		_contacted: false,
	},

	onLoad () {

  },

	// 金币是否掉落
	onEndContact (contact, selfCollider, otherCollider) {
		if (!this._contacted && selfCollider.tag == 99) {
			this._contacted = true
			this.audioPlay()
		}
	},

	audioPlay () {
		cc.audioEngine.play(cc.url.raw('resources/' + this.coinAudio), false, .5)
	},

});
