const tips = require('tip'),
	util = require('utils')
const worker = require('worker')

cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		toast: cc.Node,
		btns: cc.Node,
		time3s: cc.Node,
		consumeCoinNum: 0,
		_vm: null,
		_tips: null,
		_showNum: 0,
		_consumed: null,
	},

	onLoad () {
		this.initTips()
		this._vm = this.getData()
		this._vm && this.setEnemy(this._vm.enemy)
		this.enemy && this.enemy.getComponent(cc.Animation).play('breath')

		// cc.loader.load('http://superplayer.cmcmcdn.com/avator/11.jpg', function(err, texture) {
		// 	console.log('onload texture', texture)
		// })
		// this.loadRemoteImg('http://superplayer.cmcmcdn.com/avator/11.jpg')
	},

	loadRemoteImg(url) {
		var Base64 = {
			_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			encode: function encode(input) {
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;
				//input = Base64._utf8_encode(input); //comment out to encode binary file(like image)
				while (i < input.length) {
					chr1 = input[i++];
					chr2 = input[i++];
					chr3 = input[i++];
					enc1 = chr1 >> 2;
					enc2 = (chr1 & 3) << 4 | chr2 >> 4;
					enc3 = (chr2 & 15) << 2 | chr3 >> 6;
					enc4 = chr3 & 63;
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
				}
				return output;
			}
		}
		var img = null;
		var xmlhttp = new XMLHttpRequest();
		var xhr = xmlhttp;
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				console.log('onreadystatechange xhr', xhr)
				//console.log(xhr.responseText);
				//var res = xhr.responseText;
				var blob = new Uint8Array(this.response);
				var img = new Image();
				var base = "data:image/png;base64," + Base64.encode(blob);
				img.src = base;
				var spriteFrame = spImg.getComponent('cc.Sprite').spriteFrame;
				//var texture=spriteFrame.getTexture();
				var texture = new cc.Texture2D();
				texture.generateMipmaps = false;
				texture.initWithElement(img);
				texture.handleLoadedTexture();
				var newframe = new cc.SpriteFrame(texture);
				console.log('newframe', newframe)
				spImg.getComponent('cc.Sprite').spriteFrame = newframe;
			}
		};
		xmlhttp.open("get", url);
		xhr.responseType = 'arraybuffer';
		xhr.send(null);
	},

	getData () {
		const node = cc.director.getScene().getChildByName('data-store')
		if(!node) return
		const data = node.getComponent('datastore-script') && node.getComponent('datastore-script').getdata()
		return cc.clone(data)
	},

	initHPBar (bar) {
		console.log('initHPBar bar', bar)
		if (!bar) return
		const full = bar.getChildByName('full'),
			reduce = bar.getChildByName('reduce'),
			progress = bar.getComponent('cc.ProgressBar')
		if (this._vm.enemy.hp_max >= this._vm.enemy.hp) {
			reduce.active = true
			progress.barSprite = reduce
		} else {
			full.active = true
			progress.barSprite = full
		}
		console.log('progress', progress)
	},

	initTips () {
		this._tips = []
		this._showNum = 3
		for (let i = 0; i < this._showNum; i++) {
			const tip = tips.data[Math.floor(Math.random()*tips.data.length)]
			if (~this._tips.indexOf(tip)) {
				i--
			} else {
				this._tips.push(tip)
			}
		}
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
		hpVal && (data.hp_max>=data.hp) && (hpVal.string = Math.floor(data.hp/10000)+'HP / ' + Math.floor(data.hp_max/10000)+'HP')
		attackNum && (data.attack_user_num = data.attack_user_num>=0?data.attack_user_num:0) && (attackNum.string = Math.floor(data.attack_user_num))
		this.initHPBar(bar)
	},

	toPlayScene () {
		this.btns && (this.btns.active = false)
		this.toastShow(0, function()  {
			cc.director.loadScene("game-playing-scene")
		})
	},

	toRankScene () {
		cc.director.loadScene("rank-scene")
	},

	toastShow (delay, cb) {
		this.toast.active = true
		let self = this,
			step = this._showNum,
			timeLabel = this.time3s.getComponent('cc.Label'),
			tipLabel = this.toast.getChildByName('tip').getComponent('cc.Label'),
			enlarge = cc.scaleTo(.2, 1.4),
			reduce = cc.scaleTo(.1, 0.9),
			enlarge1 = cc.scaleTo(.1, 1),
			reduce1 = cc.scaleTo(.2, 0),
			fadeIn = cc.fadeIn(.1),
			fadeOut = cc.fadeOut(.4),
			sequences = [fadeIn, enlarge, reduce, enlarge1, fadeOut]
		// sequences = [enlarge, reduce, reduce1]
		this.time3s.setScale(0, 0)
		self.func = function () {
			timeLabel.string = step + ''
			tipLabel.string = this._tips[step - 1]
			this.time3s.runAction(cc.sequence(...sequences, cc.callFunc(function () {
				this.time3s.setScale(0, 0)
				if (--step === 0) {
					self.unschedule(self.func, self)
					cb && cb()
				}
			}, this)))
		}
		self.func()
		self.schedule(self.func, 1, cc.macro.REPEAT_FOREVER, delay)
	},

	consumeCoin () {
		const node = cc.director.getScene().getChildByName('data-store'),
			coin = this._vm&&this._vm.user_attrs? this._vm.user_attrs.coin : 0
		if(!node || this._consumed) return
		if ( coin < this.consumeCoinNum) {
			const noEnough = this.toast.getChildByName('no-enough-tip'),
				button = this.toast.getChildByName('button'),
				btn = button.getComponent(cc.Button),
				coin = button.getChildByName('coin'),
				greyCoin = button.getChildByName('grey-coin'),
				num = button.getChildByName('num')
			noEnough.active = true
			btn.interactable = false
			coin.active = false
			greyCoin.active = true
			num.color = new cc.Color(202, 202, 202)
		}
		console.log('in consumeCoin this._vm', this._vm)
		const dataStore = node.getComponent('datastore-script')
		dataStore.setUseCoin(this.consumeCoinNum)
		// 目前只有id=1的消耗品表,且没有获取的api
		dataStore.setBuyId(1)
		// const randomNumBoth = (Min, Max) => {
		// 	let Range = Max - Min,
		// 		Rand = Math.random()
		// 	return Min + Math.round(Rand * Range)
		// }
		const gainBoom = util.randomNumBoth(5, 50)
		// 提升暴击率
		dataStore.setGainBoom(gainBoom / 100)
		this._consumed = true
	}

});
