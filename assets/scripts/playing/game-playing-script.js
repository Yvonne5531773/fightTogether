import resource from 'assets/resources/index'

cc.Class({
	extends: cc.Component,

	properties: {
		enemy: cc.Node,
		knifePrefab: cc.Prefab,
		timeLabel: cc.Label,
		knifeScript: '',
		knifeCtr: {
			type: cc.Node,
			default: null
		},
		_timeScore: 0,
		_timeSI: null,
	},

	onLoad () {
		this.initKnife(this.knifePrefab)
		//初始化倒计时
		this.initCountDown(this._timeScore = 3)
		//加载音乐文件
		// const node = cc.director.getScene().getChildByName('data-store'),
		// 	data = node? node.getComponent('datastore-script').getdata():{},
		// 	songURL = data.url || ''
		// cc.loader.loadRes(songURL, this.onLoadMusicCompleted.bind(this))

		//开启物理系统
		cc.director.getPhysicsManager().enabled = true
	},

	initSong (data) {
		this._soundData = data.musics[0];
		let arr,
			scores = this._soundData.scores,
			score = scores[0];
		score = this.replaceAll(score)
		arr = score.split(",")
		this._soundArr = arr;
	},

	initKnife (knifePrefab) {
		if(!knifePrefab) return
		const knife = cc.instantiate(knifePrefab)
		this.knifeCtr.addChild(knife)
		knife.getComponent(this.knifeScript).init(this)
	},

	initCountDown (time) {
		this.setTimeLabel(time)
		let count = time
		this._timeSI = setInterval( () => {
			count <= 0 && (clearInterval(this._timeSI), this.endGame())
			this.setTimeLabel(count--)
		}, 1000)
	},

	setTimeLabel (time) {
		this.timeLabel.string = time + 's'
	},

	endGame () {
		//停止动画
		this.enemy.getComponent('game-enemy-script').stopAnimate()
	},

	addTile () {
		const y = this._tilesArr.length===0? 0 : this._tilesArr[this._tilesArr.length - 1].y,
			i = Math.floor(Math.random() * this._arr.length),
			num = this._arr[i]
		let prefab = {},
			type = '',
			tile = {}
		if (this._arr.splice(i, 1),
			-1 !== this._preTx && this._arr.push(this._preTx),
			0 === this.movePanel.children.length){
			prefab = this.bluePrefab;
			type = 'START'
		} else {
			const rand = Math.floor(Math.random() * 100);
			if(30 >= rand) {
				prefab = this.longPrefab
				type = 'LONG'
			} else {
				prefab = this.blackPrefab
				type = 'BLACK'
			}
		}
		tile = cc.instantiate(prefab);
		tile.getComponent("tile-script").init(type, this);
		tile && (this._tilesArr.push(tile),
			tile.name = 'TILE_' + type,
			tile.scaleX = this.tileWidth / 136,
			tile.scaleY = this.tileHeight / 238,
			this.movePanel.addChild(tile),
			tile.x = num * this.tileWidth,
			tile.y = y + this.tileHeight),
			tile._destory = false,
			this._preTx = num
	},

	onLoadMusicCompleted (err, res) {
		if(err) {
			console.log('error: ', err)
			return
		}
		this.initSong(res)
	},

	onTap () {
		let name,
			a = null,
			sound = this._soundArr[this._idx];
		sound && !!~sound.indexOf("(") ? (sound = sound.replace(/\(/gm, ""),
			sound = sound.replace(/\)/gm, ""),
			a = sound.split("."),
			name = a[a.length - 1] + "_mp3") : (name = sound + "_mp3")
		const res = resource.resources.find((resource) => {
			return resource.name === name
		})
		//播放每个键音
		res && cc.audioEngine.play(cc.url.raw('resources/'+res.url), false, 1)
		this.checkWin()
	},

	checkWin() {
		this._idx++
		this.setScoreLabel(++this._score)
	},

	showWrongBlackTile(tile) {
		const fadeIn = cc.fadeIn(.6).easing(cc.easeCubicActionOut()),
			fadeOut = cc.fadeOut(.6).easing(cc.easeCubicActionOut()),
			sequences = [fadeIn, fadeOut, fadeIn, fadeOut, fadeIn]
		tile.runAction(cc.sequence(...sequences, cc.callFunc(function() {
			this.restart()
		}, this)))
	},

	showWrongRedTile(x, y) {
		const tile = cc.instantiate(this.redPrefab);
		const fadeIn = cc.fadeIn(.6).easing(cc.easeCubicActionOut()),
			fadeOut = cc.fadeOut(.6).easing(cc.easeCubicActionOut()),
			sequences = [fadeIn, fadeOut, fadeIn, fadeOut, fadeIn]
		tile && (
			tile.name = 'TILE_' + 'RED',
				tile.scaleX = this.tileWidth / 136,
				tile.scaleY = this.tileHeight / 238,
				this.movePanel.addChild(tile),
				tile.x = x * this.tileWidth,
				tile.y = (y + 1 + this._newTopRow) * this.tileHeight - this._offestY,
				tile.runAction(cc.sequence(...sequences, cc.callFunc(function() {
					this.restart()
				}, this))),
				this.gameover(this._errors[0])
		)
	},

	restart () {
		cc.director.loadScene("main-scene")
	},

	replaceAll (e) {
		return e = e.replace(/;/gm, ","),
			e = e.replace(/\[L\]/gm, ""),
			e = e.replace(/\[M\]/gm, ""),
			e = e.replace(/\[N\]/gm, ""),
			e = e.replace(/\[I\]/gm, ""),
			e = e.replace(/\[J\]/gm, ""),
			e = e.replace(/\[K\]/gm, ""),
			e = e.replace(/\[KL\]/gm, ""),
			e = e.replace(/\[JK\]/gm, ""),
			e = e.replace(/\[JL\]/gm, ""),
			e = e.replace(/\[LM\]/gm, ""),
			e = e.replace(/\[LL\]/gm, ""),
			e = e.replace(/\[KM\]/gm, ""),
			e = e.replace(/\[KKK\]/gm, ""),
			e = e.replace(/\[IJ]/gm, ""),
			e = e.replace(/\[KLM]/gm, ""),
			e = e.replace(/#/gm, "_"),
			e = e.replace(/U,/gm, ""),
			e = e.replace(/T,/gm, ""),
			e = e.replace(/T/gm, ""),
			e = e.replace(/V,/gm, ""),
			e = e.replace(/V>/gm, "d"),
			e = e.replace(/5</gm, ""),
			e = e.replace(/6</gm, ""),
			e = e.replace(/>/gm, ""),
			e = e.replace(/@/gm, "."),
			e = e.replace(/~/gm, "."),
			e = e.replace(/S/gm, "d"),
			e = e.replace(/%/gm, "."),
			e = e.replace(/\^/gm, "."),
			e = e.replace(/\&/gm, "."),
			e = e.substring(0, e.lastIndexOf(","))
	},
});
