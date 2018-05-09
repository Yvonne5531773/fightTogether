cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		knifeCtr: cc.Node,
		hpBar: cc.Node,
		harmNum: cc.Prefab,
		kcoin: cc.Prefab,
		harmLabel: cc.Label,
		exceedLabel: cc.Label,
		_attack: 0,
		_harm: 0,
		_harmNumPool: null,
		_kcoinPool: null,
		_kcoinArray: null,
		_initPoolCount: 10,
		_attackNum: 0,
		_exceedMap: null,
		_harmCompleted: null,
		_totalBoom: null,
	},

	onLoad () {
		this._enemyComponent = this.enemy.getComponent('game-enemy-script')
		this._hpComponent = this.hpBar.getComponent('cc.ProgressBar')
		const ds = cc.director.getScene().getChildByName('data-store')
		this.dataStore = ds? ds.getComponent('datastore-script'):null
		// 初始化超过人数表
		this.initExcees()
		this.setExceedLabel()
		// 初始化对象池
		this.initPool()
		// 初始化暴击率
		this.initTotalBoom()
		// 初始化血条
		this.initHPBar()
		this._attack = this.getAttack()
		this._kcoinArray = []
		this._exceedNum = 0
		// 金币x坐标随机范围 (0, 100)
		this._randomRange = 100
		// 是否受伤动画中
		this._harmCompleted = false
	},

	onEnable () {
		cc.director.getCollisionManager().enabled = true;
	},

	onDisable () {
		cc.director.getCollisionManager().enabled = false;
	},

	onCollisionEnter (other, self) {
		if (self.tag === 1) {
			//敌人受伤状态
			if (!this._enemyComponent) return
			!this._harmCompleted && (this._enemyComponent.animate(2),
				this._harmCompleted = true)
			// 造成伤害
			let isBoom = false
			if (Math.floor(Math.random()*100) <= this._totalBoom*100) {
				isBoom = true
			}
			console.log('isBoom', isBoom)
			// 暴击后伤害加倍
			let attack = isBoom? this._attack* 2 : this._attack
			console.log('attack', attack)
			this._harm += attack
			this.setHarmLabel(this._harm)
			// 显示伤害值
			attack = 112233
			this.createHarmNum(this.harmNum, attack)
			//血条减少
			this._HP -= attack
			this.setHPBar(this._HP)
			//显示超越数值
			this.setExceedLabel()
			//氪币掉落
			const hitPosition = other.node.getPosition()
			this.createKcoin(hitPosition)
		}
	},

	//受伤动画结束
	onHarmedAniCompleted () {
		this._enemyComponent.animate(1)
		this._harmCompleted = false
	},

	initExcees () {
		// 手速+暴击次数
		this._exceedMap = new Map([[.005, 55],[.01, 70],[.015, 80],[.02, 100],[.03, 130],[.04, 150],[.05, 170],[.06, 205], [.07, 245], [.08, 280], [.09, 300]])
		this._attackNum = 100
	},

	initPool () {
		this._harmNumPool = new cc.NodePool()
		this._kcoinPool = new cc.NodePool()
		for (let i = 0; i < this._initPoolCount; ++i) {
			const harmNum = cc.instantiate(this.harmNum),
				kcoin = cc.instantiate(this.kcoin)
			this._harmNumPool.put(harmNum)
			this._kcoinPool.put(kcoin)
		}
	},

	initTotalBoom () {
		if (!this.dataStore) return
		const gainBoom = this.dataStore.getGainBoom() || 0,
			boom = this._enemyComponent.getBoom() || 0
		this._totalBoom = gainBoom + boom
		console.log('getAttack gainBoom', gainBoom)
		console.log('getAttack boom', boom)
		console.log('getAttack this._totalBoom', this._totalBoom)
	},

	setHarmLabel (num) {
		if(!num) return
		this.harmLabel.string = '造成伤害' + Math.floor(num/10000)
	},

	setExceedLabel () {
		if (this._attackNum <= 0) {
			this.exceedLabel.string = '是本次首战超人!'
			return
		}
		const knife = this.knifeCtr.getChildByName('knife').getComponent('game-knife-script'),
			ss = knife? knife.getScratchSpeed() : 0
		let num = 0,
			percent = 0,
			threshold = this.getThreshold(this._exceedNum/this._attackNum)
		for (let item of this._exceedMap.entries()) {
			if (ss >= item[1]) {
				percent = item[0]
			}
		}
		num = this._attackNum>1? (this._attackNum>=100? Math.ceil(this._attackNum* percent):this._attackNum* percent): (percent>.06? 1:0)
		this._exceedNum += num* threshold
		this._exceedNum<=this._attackNum && (this.exceedLabel.string = '已超过' + Math.floor(this._exceedNum) + '名超人')
	},

	createHarmNum (harmPrefab, attack) {
		if(!harmPrefab) return
		let harmNum = null
		if (this._harmNumPool && this._harmNumPool.size() > 0) {
			harmNum = this._harmNumPool.get()
		} else {
			harmNum = cc.instantiate(harmPrefab)
		}
		this.enemy.addChild(harmNum)
		// 根据伤害构造字体图片
		this.constructNum(harmNum, attack)
		harmNum.setPosition(cc.v2(this.enemy.getPosition()))
		harmNum.setScale(.5, .5)
		const fadeIn = cc.fadeIn(.6).easing(cc.easeCubicActionIn()),
			scale = cc.scaleBy(.8, .8).easing(cc.easeCubicActionOut()),
			moveUp = cc.moveBy(.3, cc.p(0, 150)),
			fadeOut = cc.fadeOut(.6).easing(cc.easeCubicActionOut()),
			sequences = [moveUp, fadeOut]
		harmNum.runAction(cc.sequence(...sequences, cc.callFunc(function() {
			this.destoryHarmNum(harmNum)
		}, this)))
	},

	constructNum (harmNum, attack = 0) {
		if (!harmNum) return
		console.log('createHarmNum harmNum', harmNum)
		let ackArr = (attack+'').split(''),
			nums = harmNum.children.map(child => child.getComponent(cc.Sprite).spriteFrame)
		harmNum.children.forEach((child, i) => {
			if (i < ackArr.length) {
				console.log('parseInt(ackArr[i])', parseInt(ackArr[i]))
				child.getComponent(cc.Sprite).spriteFrame = nums[parseInt(ackArr[i])]
				child.active = true
			}
		})
	},

	destoryHarmNum (harmNum) {
		if(!harmNum) return
		this._harmNumPool.put(cc.instantiate(this.harmNum))
		harmNum.destroy()
	},

	createKcoin (position) {
		if(!position) return
		let kcoin = this._kcoinPool && this._kcoinPool.size() > 0? this._kcoinPool.get() : cc.instantiate(this.kcoin)
		this.knifeCtr.addChild(kcoin)
		kcoin.setPosition(cc.v2(position))
		// const	kcoinAnim = kcoin.getComponent(cc.Animation)
		// kcoinAnim && (kcoinAnim.play('gold'))
		this._kcoinArray.push(kcoin)
		const x = Math.round(Math.random()* this._randomRange)* (Math.random()>0.5? 1:-1)
		this.emitTo(kcoin.getComponent('cc.RigidBody'), {x: x, y: 400})
	},

	destoryKcoin (kcoin) {
		if(!kcoin) return
		this._kcoinPool.put(cc.instantiate(this.kcoin))
		kcoin.destroy()
	},

	getAttack () {
		if (!this._enemyComponent) return
		return this._enemyComponent.getPlayerAck()
	},

	initHPBar () {
		this._HP = this._enemyComponent.getHP() || 1
		this._HPMax = this._enemyComponent.getHPMax() || 1
		this.setHPBar(this._HP)
	},

	setHPBar (hp) {
		if (hp <0 || hp > this._HPMax) return
		this._hpComponent.progress = hp / this._HPMax
		console.log('this._hpComponent', this._hpComponent)
		const hpVal = this.enemy.getChildByName('HP-val')
		hpVal.getComponent('cc.Label').string = Math.floor(hp/10000)+'HP/' + Math.floor(this._HPMax/10000)+'HP'
	},

	getThreshold (prop) {
		let threshold = 0
		if (prop < 0.1) threshold = 0.4
		else if (prop < 0.3) threshold = 0.2
		else if (prop < 0.6) threshold = 0.1
		else if (prop < 0.9) threshold = 0.05
		else threshold = 0.01
		return threshold
	},

	// 掉落金币抛物线
	emitTo (body, target) {
		let x = target.x,
			y = target.y,
			selfX = this.node.x,
			selfY = this.node.y,
			distance = Math.sqrt((x-selfX)*(x-selfX) + (y-selfY)*(y-selfY)),
			velocity = cc.v2(x-selfX, y-selfY)
		velocity.normalizeSelf()
		velocity.mulSelf(distance* 2)
		body.linearVelocity = velocity
	},

	// update (dt) {
	// 	//检测金币是否离开可视范围
	// 	this._kcoinArray.forEach((kcoin) => {
	// 		if(kcoin.getPosition().y < 0) {
	// 			this.destoryKcoin(kcoin)
	// 		}
	// 	})
	// }

});
