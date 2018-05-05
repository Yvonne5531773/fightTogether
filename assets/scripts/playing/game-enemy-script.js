cc.Class({
	extends: cc.Component,

	properties: {
		_enemyPlay: null,
		HPVal: 0
	},

	onLoad () {
		//加载敌人动画
		this._enemyPlay = this.node.getComponent(cc.Animation)
		this.animate(1)
	},

	animate (type) {
		let ani = ''
		switch (type) {
			case 1:
				ani = 'run';
				break;
			case 2:
				ani = 'harmed';
				break;
			default:
				ani = 'run';
				break;
		}
		console.log('enemy animate ani', ani)
		this._enemyPlay && this._enemyPlay.play(ani)
	},

	getHP () {
		return this.HPVal
	},

	setHP (val) {
		this.HPVal = val
	},

	stopAnimate () {
		this._enemyPlay && this._enemyPlay.stop('run')
	},

	// update (dt) {},
});
