export default {
	data: {
		enemy: {
			id:              "怪兽ID",
			name:            "哥斯拉",
			ack:             400000,
			hp:              20000000000,
			hp_max:          300000000000,
			attack_user_num: 200,
		},
		user_game_info: {
			isplayed:   0, // 是否玩过游戏, 0,没有, 1有
			giftpick:   0, // 是否领过礼包, 0, 没有, 1有,
			newcoming:  1,
		},
		gift: [
			// 本局游戏的礼包, 随机, 有可能没有
			{id: 1, name: "大礼包1", pic: "礼包图片xxxx.png"},
			{id: 2, name: "大礼包2", pic: "礼包图片xxxx.png"},
			{id: 3, name: "大礼包3", pic: "礼包图片xxxx.png"}
		],
		// 用户战斗属性
		user_attrs: {
			"coin":     100,       // 用户金币, 整形.
			"level":    19,        // 用户当前等级, 客户端
			"exp":      4200,      // 当前等级经验值
			"next_exp": 4500,      // 下一个等级经验值
			"ack":      800000,    // 攻击力
			"boom":     500,       // 暴击率
			"def":      200000,    // 防御力
			"hp":       4450000,   // 生命值,
			"title":    "超凡圣士", // 头衔, 根据不同的等级会变化
		}
	}
}