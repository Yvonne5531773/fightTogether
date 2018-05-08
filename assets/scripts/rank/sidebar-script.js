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

	init (main) {
		this.main = main
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
		// 		index: i,
		// 		iconSF:iconSF
		// 	});
		// 	this.tabs[i] = tab;
		// }
		// this.tabs[this.curTabIdx].turnBig();
		this.changeHighlight(this.curTabIdx)
	},

	tabPressed (index) {
		// for (let i = 0; i < this.tabs.length; ++i) {
		// 	let tab = this.tabs[i];
		// 	if (tab.index === index) {
		// 		tab.turnBig();
		// 		cc.eventManager.pauseTarget(tab.node);
		// 	} else if (this.curTabIdx === tab.index) {
		// 		tab.turnSmall();
		// 		cc.eventManager.resumeTarget(tab.node);
		// 	}
		// }
		this.changeHighlight(index)
		console.log('tabPressed index', index)
		this.main.switchPanel(index)
	},

	changeHighlight (index) {
		this.curTabIdx = index
		this.highlight.stopAllActions()
		this.highlight.x = this.curTabIdx * this.tabWidth
	}
});
