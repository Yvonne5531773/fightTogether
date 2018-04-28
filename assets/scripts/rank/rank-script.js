cc.Class({
	extends: cc.Component,

	properties: {
		itemTemplate: {
			default: null,
			type: cc.Prefab
		},
		scrollView: {
			default: null,
			type: cc.ScrollView
		},
		spawnCount: 0, // 实际创建的项数量
		totalCount: 0, // 在列表中显示的项数量
		spacing: 0,    // 项之间的间隔大小
		yOffest: 0,
	},

	onLoad () {
		this.content = this.scrollView.content;
		this.items = []; // 存储实际创建的项数组
		this.initialize();
		this.updateTimer = 0;
		this.updateInterval = 0.2;
		// 使用这个变量来判断滚动操作是向上还是向下
		this.lastContentPosY = 0;
		// 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
		this.bufferZone = this.spawnCount * (this.itemTemplate.data.height + this.spacing) / 2;
	},

	// 列表初始化
	initialize () {
		// 获取整个列表的高度
		this.content.height = this.totalCount * (this.itemTemplate.data.height + this.spacing) + this.spacing
		console.log('in initialize this.content.height', this.content.height)
		for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
			let item = cc.instantiate(this.itemTemplate.data)
			this.content.addChild(item)
			console.log('addChild')
			item.setPosition(0, -item.height * i - this.spacing * (i + 1) + this.yOffest)
			item.getComponent('rank-item-script').updateItem(i, i)
			this.items.push(item);
		}
	},

	// 返回item在ScrollView空间的坐标值
	getPositionInView (item) {
		let worldPos = item.parent.convertToWorldSpaceAR(item.position),
			viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos)
		return viewPos
	},

	// 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
	update (dt) {
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
				console.log('isDown')
				// 提前计算出该item的新的y坐标
				newY = items[i].y + offset;
				// 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
				// 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
				if (viewPos.y < -this.bufferZone && newY < 0) {
					console.log('update isDown 1')
					items[i].setPositionY(newY);
					let item = items[i].getComponent('rank-item-script')
					let itemId = item.itemID - items.length
					item.updateItem(i, itemId)
				}
			} else {
				// 提前计算出该item的新的y坐标
				newY = items[i].y - offset;
				// 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
				// 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
				if (viewPos.y > this.bufferZone && newY > -this.content.height) {
					console.log('isDown else newY', newY)
					console.log('isDown else viewPos.y2', viewPos.y)
					console.log('isDown else offset', offset)
					console.log('update isDown 2 this.bufferZone', this.bufferZone)
					items[i].setPositionY(newY);
					let item = items[i].getComponent('rank-item-script')
					let itemId = item.itemID + items.length
					item.updateItem(i, itemId)
				}
			}
		}
		// 更新lastContentPosY和总项数显示
		this.lastContentPosY = this.scrollView.content.y
	},

	addItem () {
		this.content.height = (this.totalCount + 1) * (this.itemTemplate.data.height + this.spacing) + this.spacing
		this.totalCount = this.totalCount + 1
	},

	removeItem () {
		if (this.totalCount - 1 < 30) {
			cc.error("can't remove item less than 30!");
			return;
		}
		this.content.height = (this.totalCount - 1) * (this.itemTemplate.data.height + this.spacing) + this.spacing
		this.totalCount = this.totalCount - 1;
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
