cc.Class({
	extends: cc.Component,

	properties: {

	},

	start () {

	},

	toPlayScene () {
		cc.director.loadScene("game-playing-scene")
	},

});
