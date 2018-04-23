cc.Class({
	extends: cc.Component,

	properties: {

	},

	onEnable () {
		cc.director.getCollisionManager().enabled = true;
	},

	onDisable () {
		cc.director.getCollisionManager().enabled = false;
	},

	onCollisionEnter (other, self) {
		if (self.tag === 1) {
			console.log('onCollisionEnter other', other)
			console.log('onCollisionEnter self', self)
		} else {

		}
	}
});
