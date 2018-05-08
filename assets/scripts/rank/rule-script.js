cc.Class({
	extends: cc.Component,

	properties: {
		rulePop: cc.Node,
		scrollViews: cc.Node,
		tabBar: cc.Node,
	},

	showRulePop () {
		this.rulePop.active = true
		this.changeTabBtn(false)
		this.changeScrollViews(false)
	},

  closeRulePop () {
	  this.rulePop.active = false
	  this.changeTabBtn(true)
	  this.changeScrollViews(true)
  },

	changeTabBtn (bool) {
		this.tabBar.children.forEach(c => {
			c.getComponent(cc.Button) && (c.getComponent(cc.Button).interactable = bool)
		})
	},

	changeScrollViews (bool) {
		this.scrollViews.children.forEach(s => {
			s.getComponent(cc.ScrollView) && (s.getComponent(cc.ScrollView).vertical = bool)
		})
	},

})
