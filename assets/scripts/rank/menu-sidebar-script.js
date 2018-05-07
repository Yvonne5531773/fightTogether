cc.Class({
	extends: cc.Component,

	properties: {
		tabIcons: {
			default: [],
			type: cc.SpriteFrame
		},
		tabPrefab: cc.Prefab,
		container: cc.Node,
		highlight: cc.Node,
		tabWidth: 0,
		tabSwitchDuration: 0,
	},

	init (mainMenu) {
		this.mainMenu = mainMenu
		this.tabSwitchDuration = 0
		this.curTabIdx = 0
		this.tabs = this.container.children
		console.log('init container children', this.container.children)
		// for (let i = 0; i < this.tabIcons.length; ++i) {
		// 	let iconSF = this.tabIcons[i];
		// 	let tab = cc.instantiate(this.tabPrefab).getComponent('TabCtrl');
		// 	this.container.addChild(tab.node);
		// 	tab.init({
		// 		sidebar: this,
		// 		idx: i,
		// 		iconSF:iconSF
		// 	});
		// 	this.tabs[i] = tab;
		// }
		// this.tabs[this.curTabIdx].turnBig();
		this.changeHighlight(this.curTabIdx)
	},

	tabPressed (idx) {
		// for (let i = 0; i < this.tabs.length; ++i) {
		// 	let tab = this.tabs[i];
		// 	if (tab.idx === idx) {
		// 		tab.turnBig();
		// 		cc.eventManager.pauseTarget(tab.node);
		// 	} else if (this.curTabIdx === tab.idx) {
		// 		tab.turnSmall();
		// 		cc.eventManager.resumeTarget(tab.node);
		// 	}
		// }
		this.changeHighlight(idx)
		// this.mainMenu.switchPanel(this.curTabIdx);
	},

	changeHighlight (index) {
		this.curTabIdx = index
		this.highlight.stopAllActions()
		this.highlight.x = this.curTabIdx * this.tabWidth
	}
});
