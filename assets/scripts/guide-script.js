cc.Class({
	extends: cc.Component,

	properties: {
		audio: {
			url: cc.AudioClip,
			default: null
		},
		_current: null
	},

	toScene () {
		this.onDestroyMusic()
		cc.director.loadScene("main-scene")
	},

	onLoad () {
		const url = 'song.json'
		this._current = 0
		cc.loader.loadRes(url, this.onCompleted.bind(this));
	},

	onCompleted (err, res) {
		if(err) return
		const data = res.data,
			node = cc.find('data-store').getComponent('datastore-script');
		node.setdata(data[0])
		this.audio && (this._current = cc.audioEngine.play(this.audio, false, 1))
	},

	start () {

	},

	onDestroyMusic () {
		cc.audioEngine.stop(this._current);
	}
});
