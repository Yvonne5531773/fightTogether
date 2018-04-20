cc.Class({
	extends: cc.Component,

	properties: {
		_type: null,
		_mainScript: null,
	},

	init (type, mainScript) {
		this._type = type;
		this._mainScript = mainScript;
		const touchFunc = (e) => {
			e.stopPropagation()
			if(this._mainScript._tilesArr[this._mainScript._curBottomRow] === this.node) {
				this.node.off("touchstart", touchFunc, false);
				//改变透明度
				this.node.opacity = 80
				this._type === 'START' && (this._mainScript._start = true, this._mainScript.node.on("touchstart", this.onStartDown, this))
				const curTile = this._mainScript._tilesArr[this._mainScript._curBottomRow]
				curTile._destory = !curTile._destory
				this._mainScript._curBottomRow++
				//音效和是否胜利
				this._mainScript.onTap()
			} else {
				if(!this._mainScript._start) return
				if(!!~['BLACK', 'LONG'].indexOf(this.node.type)) {
					console.log('nothing')
				} else {
					this._mainScript.gameover(this._mainScript._errors[0]);
				}
			}
		}
		this.node.on("touchstart", touchFunc, this);
	},

	onStartDown (e) {
		this._mainScript.node.off("touchstart", this.onStartDown, this)
		e.stopPropagation()
		let x = e.touch.getLocation().x;
		let y = e.touch.getLocation().y;
		let blockX = Math.floor(x / this._mainScript.tileWidth);
		let blockY = 0;
		for (let i = this._mainScript.movePanel.children.length - 1; i >= 0; i--) {
			let distance = this._mainScript.movePanel.children[i].y - y;
			if (distance <= this._mainScript.tileHeight && distance >= 0) {
				blockY = i;
				break;
			}
		}
		this._mainScript.showWrongRedTile(blockX, blockY)
	},

	// update (dt) {
	//
	// },

});
