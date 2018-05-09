cc.Class({
	extends: cc.Component,

	properties: {
		token: '',
		useCoin: 0,
		gainBoom: 0,
		saveInfo: null
	},

	onLoad () {
		//动态引入
		cc.game.addPersistRootNode(this.node)
		this.saveInfo = {}
	},

	getdata (){
		return this.data
	},

	setdata (json){
		this.data = json
	},

	getToken (){
		return this.token
	},

	setToken (token){
		this.token = token
	},

	getUseCoin (){
		return this.useCoin
	},

	setUseCoin (useCoin){
		this.useCoin = useCoin
	},

	getGainBoom (){
		return this.gainBoom
	},

	setGainBoom (gainBoom){
		this.gainBoom = gainBoom
	},

	getSaveInfo () {
		return this.saveInfo
	},

	setSaveInfo (criteria) {
		this.saveInfo = criteria
	},

});
