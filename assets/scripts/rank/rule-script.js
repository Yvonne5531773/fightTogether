cc.Class({
	extends: cc.Component,

	properties: {
		rulePop: cc.Node,
	},

	onLoad () {
    console.log('onLoad this.rulePop', this.rulePop)
  },

	showRulePop () {
		console.log('showRulePop this.rulePop', this.rulePop)
		this.rulePop.active = true
	},

  closeRulePop () {
	  this.rulePop.active = false
  },
});
