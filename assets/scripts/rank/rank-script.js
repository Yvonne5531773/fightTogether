const titleRanks = require('title-rank')
const totalRanks = require('total-rank')
const MenuSidebar = require('sidebar-script')

cc.Class({
	extends: cc.Component,

	properties: {
		itemTemplate: cc.Prefab,
		currentTemplate: cc.Node,
		scrollViews: cc.Node,
		sidebar: MenuSidebar,
		spacing: 0,       //  项之间的间隔大小
		maxCount: 0,      //  最大数量
		minCount: 0,      //  最小数量
		yOffest: 0,
		addCount: 0,
		panelWidth: 0,
		tabSwitchDuration: 0,
		_totalCount: 0,   //  在列表中显示的项数量
		_map: null,
		_currentSV: ''
	},

	onLoad () {
		this._currentSV = 'title'
		this.sidebar.init(this)
		// map存储滚动信息
		this.initMap()
		// 排行榜信息
		this.initScrollView(this._currentSV)
		this.updateTimer = 0
		this.updateInterval = 0.2
	},

	initMap () {
		const data = [
			['title', {
				scrollView: this.scrollViews.getChildByName('title-scrollview').getComponent(cc.ScrollView),
				bufferZone: 0,
				currentUser: {},
				_vm: [],
				_addCount: 0,
				_lastContentPosY: 0,  // 使用这个变量来判断滚动操作是向上还是向下
				_totalCount: 0,
			}],
			['total', {
				scrollView: this.scrollViews.getChildByName('total-scrollview').getComponent(cc.ScrollView),
				bufferZone: 0,
				currentUser: {},
				_vm: [],
				_addCount: 0,
				_lastContentPosY: 0,
				_totalCount: 0,
			}]
		]
		this._map = new Map(data)
	},

	// 列表初始化
	initScrollView (key) {
		console.log('initScrollView key', key)
		const sv = this._map.has(key)? this._map.get(key):{}
		sv.items = []   // 存储实际创建的项数组
		sv._vm = this.getItem(0, this.minCount, key)
		sv.currentUser = this.getUser(key)
		if (sv._vm && sv._vm.length < this.minCount) {
			sv._totalCount = sv._vm.length
		} else {
			sv._totalCount = this.minCount
		}
		// 获取整个列表的高度
		const content = sv.scrollView.content
		content.height = sv._totalCount * (this.itemTemplate.data.height + this.spacing) + this.spacing
		for (let i = 0; i < sv._totalCount; ++i) {
			let item = cc.instantiate(this.itemTemplate.data)
			content.addChild(item)
			item.setPosition(0, -item.height * i - this.spacing * (i + 1) + this.yOffest)
			item.getComponent('rank-item-script').updateItem(sv._vm[i], i)
			sv.items.push(item)
		}
		// 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
		// 若数据的总高度小于设定的scrollview高度，则缓冲区高度用总高度
		const totalHeight = sv._totalCount* (this.itemTemplate.data.height + this.spacing)
		sv.bufferZone = totalHeight > sv.scrollView.node.height? totalHeight/ 2 : totalHeight
		// 当前用户信息
		this.initCurrent(sv.currentUser)
	},

	initCurrent (data) {
		if (!data) return
		const current = this.currentTemplate
		current.getComponent('rank-item-script').updateItem(data, -1)
	},

	// 返回item在ScrollView空间的坐标值
	getPositionInView (item, scrollView) {
		let worldPos = item.parent.convertToWorldSpaceAR(item.position),
			viewPos = scrollView.node.convertToNodeSpaceAR(worldPos)
		return viewPos
	},

	getItem (min, max, key) {
		return key==='title'? titleRanks.data.slice(min, max) : totalRanks.data.slice(min, max)
	},

	getUser (key) {
		return key==='title'?{
			name: 'currentusercurrentusercurrentuser'
		}:{
			name: '111111111111111111111111111111111'
		}
	},

	addItem (count, sv) {
		sv.scrollView.content.height = (sv._totalCount + count) * (this.itemTemplate.data.height + this.spacing) + this.spacing
		sv._totalCount += count
	},

	removeItem (sv) {
		sv.scrollView.content.height = (sv._totalCount - 1) * (this.itemTemplate.data.height + this.spacing) + this.spacing
		sv._totalCount = sv._totalCount - 1;
	},

	scrollToFixedPosition (scrollView) {
		// 在2秒内完成
		scrollView.scrollToOffset(cc.p(0, 500), 2)
	},

	switchPanel (index = 0) {
		this._currentSV = parseInt(index)===0? 'title' : 'total'
		const sv = this._map.has(this._currentSV)? this._map.get(this._currentSV):{}
		// 没有数据就重新拉取
		sv._vm.length<=0 && this.initScrollView(this._currentSV)
		const newX = index * -this.panelWidth,
			rollerMove = cc.moveTo(this.tabSwitchDuration, cc.p(newX, 0)).easing(cc.easeQuinticActionInOut()),
			callback = cc.callFunc(this.onSwitchPanelFinished, this)
		this.scrollViews.stopAllActions()
		cc.eventManager.pauseTarget(this.scrollViews)
		this.scrollViews.runAction(cc.sequence(rollerMove, callback))
		this.initCurrent(sv.currentUser)
	},

	onSwitchPanelFinished () {
		cc.eventManager.resumeTarget(this.scrollViews);
	},

	// 每帧调用一次。根据滚动位置动态更新item的坐标和显示
	update (dt) {
		const key = this._currentSV,
			sv = this._map.has(key)? this._map.get(key):{}
		if (sv._totalCount < this.minCount) return
		this.updateTimer += dt;
		if (this.updateTimer < this.updateInterval) {
			return
		}
		this.updateTimer = 0;
		let items = sv.items;
		// 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
		let isDown = sv.scrollView.content.y < sv._lastContentPosY
		// 实际创建项占了多高（即它们的高度累加）
		let offset = (this.itemTemplate.data.height + this.spacing) * items.length;
		let newY = 0
		// 遍历数组，更新item的位置和显示
		for (let i = 0; i < items.length; ++i) {
			let viewPos = this.getPositionInView(items[i], sv.scrollView)
			if (isDown) {
				// 提前计算出该item的新的y坐标
				newY = items[i].y + offset;
				// 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
				// 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
				if (viewPos.y < -sv.bufferZone && newY < 0) {
					items[i].setPositionY(newY)
					let item = items[i].getComponent('rank-item-script')
					let itemId = item.itemID - items.length
					item.updateItem(sv._vm[itemId], itemId)
				}
			} else {
				// 滚动条往下
				// 提前计算出该item的新的y坐标
				newY = items[i].y - offset
				// 判断是否要获取新的数据
				// 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
				// 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
				if (viewPos.y > sv.bufferZone) {
					if (sv._addCount <= 0 && sv._totalCount < this.maxCount) {
						const addData = this.getItem(sv._vm.length, sv._vm.length + this.addCount, key)
						if (addData && addData.length > 0) {
							sv._vm = sv._vm.concat(addData)
							this.addItem(addData.length, sv)
							sv._addCount = addData.length
						}
					}
					if (newY > -sv.scrollView.content.height) {
						items[i].setPositionY(newY)
						let item = items[i].getComponent('rank-item-script')
						let itemId = item.itemID + items.length
						item.updateItem(sv._vm[itemId], itemId)
						sv._addCount--
					}
				}
			}
		}
		// 更新lastContentPosY和总项数显示
		sv._lastContentPosY = sv.scrollView.content.y
	},

	scrollEvent (sender, event) {
		// switch(event) {
		// 	case 0:
		// 		console.log('Scroll to Top')
		// 		break;
		// 	case 1:
		// 		console.log('Scroll to Bottom')
		// 		break;
		// 	case 2:
		// 		console.log('Scroll to Left')
		// 		break;
		// 	case 3:
		// 		console.log('Scroll to Right')
		// 		break;
		// 	case 4:
		// 		console.log('Scrolling')
		// 		break;
		// 	case 5:
		// 		console.log('Bounce Top')
		// 		break;
		// 	case 6:
		// 		console.log('Bounce bottom')
		// 		break;
		// 	case 7:
		// 		console.log('Bounce left')
		// 		break;
		// 	case 8:
		// 		console.log('Bounce right')
		// 		break;
		// 	case 9:
		// 		console.log('Auto scroll ended')
		// 		break;
		// }
	}

})
