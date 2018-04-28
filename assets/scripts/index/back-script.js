import api from '../../resources/javascripts/api'

cc.Class({
	extends: cc.Component,

	properties: {

	},

	toApp () {
		api.back2App()
	},

});
