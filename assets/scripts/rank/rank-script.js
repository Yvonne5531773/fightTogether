const ranks = require('rank')

cc.Class({
	extends: cc.Component,

	properties: {
		itemTemplate: {
			default: null,
			type: cc.Prefab
		},
		currentTemplate: {
			default: null,
			type: cc.Node
		},
		scrollView: {
			default: null,
			type: cc.ScrollView
		},
		spacing: 0,       //  项之间的间隔大小
		maxCount: 0,      //  最大数量
		minCount: 0,      //  最小数量
		yOffest: 0,
		addCount: 0,
		_totalCount: 0,   //  在列表中显示的项数量
		_addCount: 0,
		_vm: null
	},

	onLoad () {
		this.content = this.scrollView.content
		this.items = [] // 存储实际创建的项数组
		this.initialize()
		this.updateTimer = 0
		this.updateInterval = 0.2
		// 使用这个变量来判断滚动操作是向上还是向下
		this.lastContentPosY = 0
		// 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
		// 若数据的总高度小于设定的scrollview高度，则缓冲区高度用总高度
		const totalHeight = this._totalCount* (this.itemTemplate.data.height + this.spacing)
		this.bufferZone = totalHeight > this.scrollView.node.height? totalHeight/ 2 : totalHeight
		// 当前用户
	},

	// 列表初始化
	initialize () {
		this._vm = this.getItem(0, this.minCount)
		if (this._vm && this._vm.length < this.minCount) {
			this._totalCount = this._vm.length
		} else {
			this._totalCount = this.minCount
		}
		// 获取整个列表的高度
		// console.log('this._vm', this._vm)
		// console.log('this._totalCount', this._totalCount)
		this.content.height = this._totalCount * (this.itemTemplate.data.height + this.spacing) + this.spacing
		for (let i = 0; i < this._totalCount; ++i) {
			let item = cc.instantiate(this.itemTemplate.data)
			this.content.addChild(item)
			item.setPosition(0, -item.height * i - this.spacing * (i + 1) + this.yOffest)
			item.getComponent('rank-item-script').updateItem(this._vm[i], i)
			this.items.push(item);
		}
		this.initCurrent({
			name: 'currentusercurrentusercurrentuser'
		})
	},

	initCurrent (data) {
		if (!data) return
		const current = this.currentTemplate
		current.getComponent('rank-item-script').updateItem(data, -1)
	},

	// 返回item在ScrollView空间的坐标值
	getPositionInView (item) {
		let worldPos = item.parent.convertToWorldSpaceAR(item.position),
			viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos)
		return viewPos
	},

	// 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
	update (dt) {
		if (this._totalCount < this.minCount) return
		this.updateTimer += dt;
		if (this.updateTimer < this.updateInterval) {
			return
		}
		this.updateTimer = 0;
		let items = this.items;
		// 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
		let isDown = this.scrollView.content.y < this.lastContentPosY
		// 实际创建项占了多高（即它们的高度累加）
		let offset = (this.itemTemplate.data.height + this.spacing) * items.length;
		let newY = 0;
		// 遍历数组，更新item的位置和显示
		for (let i = 0; i < items.length; ++i) {
			let viewPos = this.getPositionInView(items[i]);
			if (isDown) {
				// 提前计算出该item的新的y坐标
				newY = items[i].y + offset;
				// 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
				// 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
				if (viewPos.y < -this.bufferZone && newY < 0) {
					items[i].setPositionY(newY)
					let item = items[i].getComponent('rank-item-script')
					let itemId = item.itemID - items.length
					console.log('before update itemId', itemId)
					item.updateItem(this._vm[itemId], itemId)
				}
			} else {
				// 滚动条往下
				// 提前计算出该item的新的y坐标
				newY = items[i].y - offset
				// 判断是否要获取新的数据
				// 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
				// 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
				if (viewPos.y > this.bufferZone) {
					if (this._addCount <= 0 && this._totalCount < this.maxCount) {
						const addData = this.getItem(this._vm.length, this._vm.length + this.addCount)
						if (addData && addData.length <= 0) return
						this._vm = this._vm.concat(addData)
						this.addItem(addData.length)
						this._addCount = addData.length
					}
					if (newY > -this.content.height) {
						items[i].setPositionY(newY)
						let item = items[i].getComponent('rank-item-script')
						let itemId = item.itemID + items.length
						item.updateItem(this._vm[itemId], itemId)
						this._addCount--
					}
				}
			}
		}
		// 更新lastContentPosY和总项数显示
		this.lastContentPosY = this.scrollView.content.y
	},

	getItem (min, max) {
		return ranks.data.slice(min, max)
	},

	addItem (count) {
		this.content.height = (this._totalCount + count) * (this.itemTemplate.data.height + this.spacing) + this.spacing
		this._totalCount += count
	},

	removeItem () {
		this.content.height = (this._totalCount - 1) * (this.itemTemplate.data.height + this.spacing) + this.spacing
		this._totalCount = this._totalCount - 1;
	},

	scrollToFixedPosition () {
		// 在2秒内完成
		this.scrollView.scrollToOffset(cc.p(0, 500), 2);
	},

	scrollEvent (sender, event) {
		switch(event) {
			case 0:
				console.log('Scroll to Top')
				break;
			case 1:
				console.log('Scroll to Bottom')
				break;
			case 2:
				console.log('Scroll to Left')
				break;
			case 3:
				console.log('Scroll to Right')
				break;
			case 4:
				console.log('Scrolling')
				break;
			case 5:
				console.log('Bounce Top')
				break;
			case 6:
				console.log('Bounce bottom')
				break;
			case 7:
				console.log('Bounce left')
				break;
			case 8:
				console.log('Bounce right')
				break;
			case 9:
				console.log('Auto scroll ended')
				break;
		}
	}

})
