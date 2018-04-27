# Game powered by cocos creator supported game master app

~~~
 Create date: 2018.04.21
 Developers and supports: CM.Front-end.Team
~~~ 

> cocos creator

> vue.js


## 目录结构

~~~
server api

测试服url http://10.12.32.183:8080
测试token RlIzRIZXE3dQ6UxY0qvsiBFiROh97n95
body {
      "token": "RlIzRIZXE3dQ6UxY0qvsiBFiROh97n95",
      "ts": 1524820162000,
      "uuid": "test"
     }
线上服url

/*  获取游戏相关信息
    @param id (number)
    @return info (json)
     {
        enemy,                      敌人信息
        rank,                       当前排名
        player,                     用户角色属性 
        playedNum,                  已经玩过的人数
        experience,                 总经验值
        level,                      等级
        kcoin,                      用户总氪币
        prizes (array length = 3)   奖品信息
        [{
           id,
           avatar,
           name,
        }],
        isPlayed                    是否已玩
     }
*/
getGameInfoByUserId


/*  存储数据
    @param  data (json)
    {
        enemy,                      敌人信息(总伤值)
        time,                       攻击总时间
        strokes,                    划动次数 总划屏数
        kcoinNum,                   氪币数
        buyed                       是否买了氪币
    }
    @return ret
*/
saveGameInfo


/*  选中奖品
    @param  id (number)             奖品id
    @return ret
*/
savePrize


/*  获取排行榜 
    @param  id (number)     用户id        
            minIndex        范围最小下标         
            maxIndex        范围最大下标
    @return rank (json)
     {
        current: {          当前用户排名信息
            id,
            name,
            level,
            avatar,
            harm,           伤害值
            titleRank       头衔榜的排名
            generalRank     总榜单的排名
        },
        titleRanks: [{      头衔榜列表 (已排序)
            id,
            name,
            level,
            avatar,
            harm,           伤害值
        }],     
        generalRanks: [{    总榜列表 (已排序)
            id,
            name,
            level,
            avatar,
            harm,           伤害值
        }]    
     }
*/
getRankByUserId

~~~

~~~
android api

/*  进入游戏
    @param  token
*/
通过url访问带 token 参数

/*  返回用户界面
    @param  null
    @return ret
*/
GameMatserNative.finish()

dat 打包
远程 debug
断网情况
~~~