cc.Class({
	extends: cc.Component,

	properties: {
		token: '',
		_uuid: '',
		enemyId: 0,
		harm: 0,
		time: 0,
		strokes: 0,
		useCoin: 0,
		getCoin: 0,
		buyId: 0,
		gainBoom: 0,
		saveInfo: null,
		gifts: 0,
	},

	onLoad () {
		//动态引入
		cc.game.addPersistRootNode(this.node)
	},

	getdata () {
		return this.data
	},

	setdata (json) {
		this.data = json
	},

	getUuid () {
		return this._uuid
	},

	setUuid (_uuid) {
		this._uuid = _uuid
	},

	getToken () {
		return this.token
	},

	setToken (token) {
		this.token = token
	},

	getEnemyId () {
		return this.enemyId
	},

	setEnemyId (enemyId) {
		this.enemyId = enemyId
	},

	getUseCoin () {
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

	getHarm (){
		return this.harm
	},

	setHarm (harm){
		this.harm = harm
	},

	getTime (){
		return this.time
	},

	setTime (time){
		this.time = time
	},

	getStrokes (){
		return this.strokes
	},

	setStrokes (strokes){
		this.strokes = strokes
	},

	getGetCoin (){
		return this.getCoin
	},

	setGetCoin (getCoin){
		this.getCoin = getCoin
	},

	getBuyId (){
		return this.buyId
	},

	setBuyId (buyId){
		this.buyId = buyId
	},

	getSaveInfo () {
		return this.saveInfo
	},

	setSaveInfo (criteria) {
		this.saveInfo = criteria
	},

	getGifts () {
		return this.gifts
	},

	setGifts (gifts) {
		this.gifts = gifts
	},

});
