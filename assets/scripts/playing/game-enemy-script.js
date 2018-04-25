cc.Class({
	extends: cc.Component,

	properties: {
		_enemyPlay: null,
		HPVal: 0
	},

	onLoad () {
		//加载敌人动画
		this._enemyPlay = this.node.getComponent(cc.Animation)
		this._enemyPlay && (this._enemyPlay.play('run'))

		//开启物理系统
		cc.director.getPhysicsManager().enabled = true
	},

	getHP () {
		return this.HPVal
	},

	setHP (val) {
		this.HPVal = val
	},

	// update (dt) {},
});
