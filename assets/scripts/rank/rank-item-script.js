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

	onLoad: function () {
		// this.node.on('touched', function() {
		// 	console.log('Item ' + this.itemID + ' clicked');
		// }, this);
	},

	updateItem: function(tmplId, itemId) {
		console.log('updateItem tmplId', tmplId)
		this.itemID = itemId;
		this.label.string = 'Tmpl#' + tmplId + ' Item#' + itemId;
	},

});
