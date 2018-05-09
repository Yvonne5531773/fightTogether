cc.Class({
	extends: cc.Component,

	properties: {
		_HPVal: 0,
		_HPMaxVal: 0,
		_playerAck: 0,
		_attackNum: 0,
		_boom: 0,
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
		this._enemyPlay && this._enemyPlay.play(ani)
	},

	stopAnimate () {
		this._enemyPlay && this._enemyPlay.stop('breath')
	},

	getHP () {
		return this._HPVal
	},

	setHP (val) {
		this._HPVal = val
	},

	getHPMax () {
		return this._HPMaxVal
	},

	setHPMax (val) {
		this._HPMaxVal = val
	},

	getPlayerAck () {
		return this._playerAck
	},

	setPlayerAck (val) {
		this._playerAck = val
	},

	getBoom () {
		return this._boom
	},

	setBoom (val) {
		this._boom = val
	},

	getAttackNum () {
		return this._attackNum
	},

	setAttackNum (num) {
		if (!num) return
		this._attackNum = num
		console.log('setAttackNum num', num)
	},

});
