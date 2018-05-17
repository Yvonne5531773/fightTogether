cc.Class({
	extends: cc.Component,

	properties: {
    sprite: {
      default: null,
      type: cc.Sprite
    },
		label: {
			default: null,
			type: cc.Label
		},
		index: 0
	},

	onLoad () {
		// this.node.on('touched', function() {
		// 	console.log('Item ' + this.itemID + ' clicked');
		// }, this);
	},

	updateItem (data, index) {
		this.index = index
		console.log('updateItem data', data)
		this.label.string = 'name:' + data.nickname
	},

});
