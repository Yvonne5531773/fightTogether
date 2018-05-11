const util = require('utils')

cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		knifeCtr: cc.Node,
		hpBar: cc.Node,
		harmNum: cc.Prefab,
		harmNumBoom: cc.Prefab,
		kcoin: cc.Prefab,
		harmLabel: cc.Label,
		exceedLabel: cc.Label,
		hitAudio: '',
		giftProb: 0,
		_attack: 0,
		_harm: 0,
		_strokes: 0,
		_getCoin: 0,
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
		// this._kcoinArray = []
		this._exceedNum = 0
		// 金币x坐标随机范围 (0, 100)
		this._coinRandomRange = 100
		// 是否受伤动画中
		this._harmCompleted = false
	},

	// 有效打击
	onCollisionEnter (other, self) {
		const type = this.getAnimateType(self.tag)
		if (!this._harmCompleted && this._enemyComponent && type !== 0) {
			this._harmCompleted = true
			this._enemyComponent.animate(type)
			// 是否暴击
			const isBoom = this.getBoom()
			// 暴击后伤害加倍
			const attack = this.getTotalAttack(isBoom)
			console.log('onCollisionEnter attack', attack)
			this.setHarmLabel(attack)
			// 显示伤害值
			// attack = 50
			this.createHarmNum(isBoom, Math.floor(attack/10000))
			//血条减少
			this.setHPBar(attack)
			//显示超越数值
			this.setExceedLabel()
			//氪币掉落
			this.createKcoin(other)
			// 音效
			this.audioPlay()
			// 是否获取礼包
			this.checkGift()
		}
		// 记录碰撞总次数
		this.dataStore && this.dataStore.setStrokes(this._strokes++)
	},

	onEnable () {
		cc.director.getCollisionManager().enabled = true;
	},

	onDisable () {
		cc.director.getCollisionManager().enabled = false;
	},

	//受伤动画结束
	onHarmedAniCompleted () {
		// 重置回原始状态
		this._enemyComponent.animate(1)
		this._harmCompleted = false
	},

	initExcees () {
		// 手速+暴击次数
		this._exceedMap = new Map([[.005, 55],[.01, 70],[.015, 80],[.02, 100],[.03, 130],[.04, 150],[.05, 170],[.06, 205], [.07, 245], [.08, 280], [.09, 300]])
		this._attackNum = 0
	},

	initPool () {
		this._harmNumPool = new cc.NodePool()
		this._harmNumBoomPool = new cc.NodePool()
		this._kcoinPool = new cc.NodePool()
		for (let i = 0; i < this._initPoolCount; ++i) {
			const harmNum = cc.instantiate(this.harmNum),
				harmNumBoom = cc.instantiate(this.harmNumBoom),
				kcoin = cc.instantiate(this.kcoin)
			this._harmNumPool.put(harmNum)
			this._harmNumBoomPool.put(harmNumBoom)
			this._kcoinPool.put(kcoin)
		}
	},

	initTotalBoom () {
		if (!this.dataStore) return
		const gainBoom = this.dataStore.getGainBoom() || 0,
			boom = this._enemyComponent.getBoom() || 0
		this._totalBoom = gainBoom + boom
		console.log('getAttack this._totalBoom', this._totalBoom)
	},

	initHPBar () {
		this._HP = this._enemyComponent.getHP() || 1
		this._HPMax = this._enemyComponent.getHPMax() || 1
		this.setHPBar()
	},

	createHarmNum (isBoom, attack) {
		const harmPrefab = isBoom? this.harmNumBoom : this.harmNum
		console.log('createHarmNum attack', attack)
		let pool =  harmPrefab._name==='harm-number'?this._harmNumPool : this._harmNumBoomPool,
			harmNum = pool&&pool.size()>0? pool.get() : cc.instantiate(harmPrefab)
		// 设置暴击字体层级最高
		harmNum.name==='harm-number-boom' && harmNum.setLocalZOrder(1)
		this.enemy.addChild(harmNum)
		// 根据伤害构造字体图片
		this.constructNum(harmNum, attack)
		const pos = this.enemy.getPosition()
		harmNum.setPosition(cc.v2({
			x: pos.x - 25,
			y: pos.y + 200
		}))
		harmNum.setScale(.5, .5)
		const fadeIn = cc.fadeIn(.6).easing(cc.easeCubicActionIn()),
			scale = cc.scaleBy(.8, .8).easing(cc.easeCubicActionOut()),
			moveUp = cc.moveBy(1, cc.p(0, 250)),
			fadeOut = cc.fadeOut(1.4).easing(cc.easeCubicActionInOut()),
			sequences = [moveUp, fadeOut]
		// harmNum.runAction(cc.sequence(...sequences, cc.callFunc(function() {
		// 	this.destoryHarmNum(harmNum)
		// }, this)))
		harmNum.runAction(cc.spawn(...sequences))
		// harmNum.runAction(fadeOut)
	},

	createKcoin (other) {
		const position = other.node.getPosition()
		if(!position) return
		let kcoin = this._kcoinPool && this._kcoinPool.size() > 0? this._kcoinPool.get() : cc.instantiate(this.kcoin)
		this.knifeCtr.addChild(kcoin)
		kcoin.setPosition(cc.v2(position))
		// const	kcoinAnim = kcoin.getComponent(cc.Animation)
		// kcoinAnim && (kcoinAnim.play('gold'))
		// this._kcoinArray.push(kcoin)
		const x = Math.round(Math.random()* this._coinRandomRange)* (Math.random()>0.5? 1:-1)
		this.emitTo(kcoin.getComponent('cc.RigidBody'), {x: x, y: 400})
		// 记录氪币掉落次数
		this.dataStore && this.dataStore.setGetCoin(this._getCoin++)
	},

	constructNum (harmNum, attack = 0) {
		if (!harmNum) return
		let ackArr = (attack+'').split(''),
			nums = harmNum.children.map(child => child.getComponent(cc.Sprite).spriteFrame)
		harmNum.children.forEach((child, i) => {
			if (i < ackArr.length) {
				child.getComponent(cc.Sprite).spriteFrame = nums[parseInt(ackArr[i])]
				child.active = true
			}
		})
	},

	setHarmLabel (attack) {
		this._harm += attack
		this.dataStore && this.dataStore.setHarm(this._harm)
		this.harmLabel.string = '造成伤害' + Math.floor(this._harm/10000)
	},

	setExceedLabel () {
		console.log('setExceedLabel this._attackNum', this._attackNum)
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

	setHPBar (attack = 0) {
		this._HP -= attack
		let hp = this._HP
		console.log('setHPBar hp', hp)
		if (hp <0 || hp > this._HPMax) return
		this._hpComponent.progress = hp / this._HPMax
		const hpVal = this.enemy.getChildByName('HP-val')
		hpVal.getComponent('cc.Label').string = Math.floor(hp/10000)+'HP/' + Math.floor(this._HPMax/10000)+'HP'
	},

	getAttack () {
		if (!this._enemyComponent) return
		return this._enemyComponent.getPlayerAck()
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

	getAnimateType (tag) {
		let type = 0
		switch (tag) {
			case 1: type = 2;break;
			case 2: type = 3;break;
			case 4: type = 4;break;
		}
		return type
	},

	getTotalAttack (isBoom) {
		// 暴击后伤害加倍
		const tmpAck = util.randomNumBoth(this._attack, this._attack*2)
		return isBoom? tmpAck* 2 : tmpAck
	},

	getBoom () {
		return Math.floor(Math.random()*100) <= this._totalBoom*100
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

	audioPlay () {
		cc.audioEngine.play(cc.url.raw('resources/' + this.hitAudio), false, .5)
	},

	checkGift () {
		let gifts = this.dataStore?this.dataStore.getGifts():0
		console.log('checkGift gifts', gifts)
		if (gifts === 0) {
			const random = Math.random()
			random <= this.giftProb && this.dataStore && this.dataStore.setGifts(++gifts)
		}
	},

	destoryKcoin (kcoin) {
		if(!kcoin) return
		this._kcoinPool.put(cc.instantiate(this.kcoin))
		kcoin.destroy()
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
