cc.Class({
	extends: cc.Component,

	properties: {
		_enemyPlay: null,
		_attackNum: 0,
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
				ani = 'breath';
				break;
			case 2:
				ani = 'harmed';
				break;
			default:
				ani = 'breath';
				break;
		}
		console.log('enemy animate ani', ani)
		this._enemyPlay && this._enemyPlay.play(ani)
	},

	getHP () {
		return this.HPVal
	},

	getAttackNum () {
		return this._attackNum
	},

	setHP (val) {
		this.HPVal = val
	},

	setAttackNum (num) {
		if (!num) return
		this._attackNum = num
		console.log('setAttackNum num', num)
	},

	stopAnimate () {
		this._enemyPlay && this._enemyPlay.stop('breath')
	},

	// update (dt) {},
});
