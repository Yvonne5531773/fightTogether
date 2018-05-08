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
		itemID: 0
	},

	onLoad () {
		// this.node.on('touched', function() {
		// 	console.log('Item ' + this.itemID + ' clicked');
		// }, this);
	},

	updateItem (data, itemId) {
		this.itemID = itemId
		console.log('updateItem data', data)
		this.label.string = 'name:' + data.name
	},

});
