cc.Class({
	extends: cc.Component,

	properties: {

	},

	onLoad () {
		//动态引入
		cc.game.addPersistRootNode(this.node);
	},

	setdata (json){
		this.data = json;
	},

	getdata (){
		return this.data;
	},
});
