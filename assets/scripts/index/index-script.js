cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		_vm: null
	},

	onLoad () {
		this._vm = this.getData()
		console.log('index onLoad this._vm', this._vm)
		this.setEnemy(this._vm.enemy)
	},

	getData () {
		const node = cc.director.getScene().getChildByName('data-store')
		if(!node) return
		const data = node.getComponent('datastore-script') && node.getComponent('datastore-script').getdata()
		return cc.clone(data)
	},

	setEnemy (data) {
		if(!data) return
		const name = this.enemy.getChildByName('name'),
			bar = this.enemy.getChildByName('HP-bar'),
			hp = this.enemy.getChildByName('HP-val'),
			attack = this.enemy.getChildByName('attack-num'),
			nameStr = name? name.getComponent('cc.Label') : null,
			hpBarVal = bar? bar.getComponent('cc.ProgressBar') : null,
			hpVal = hp? hp.getComponent('cc.Label') : null,
			attackNum = attack? attack.getComponent('cc.Label') : null
		nameStr && (nameStr.string = data.name)
		hpBarVal && (hpBarVal.progress = data.hp/data.hp_max)
		hpVal && (data.hp_max>=data.hp) && (hpVal.string = Math.floor(data.hp/10000)+'HP/' + Math.floor(data.hp_max/10000)+'HP')
		attackNum && (data.attack_user_num = data.attack_user_num>=0?data.attack_user_num:0) && (attackNum.string = '该怪兽已被'+Math.floor(data.attack_user_num)+'人攻击')
	}

});
