// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

exports.main = async (event, context) => {
  const db = cloud.database()
  
  try {
    const res = await db.collection('matches').add({
      data: {
        activityDetail: event.activityDetail,
        cloudImageFileIds: event.cloudImageFileIds,
        maxPlayers: parseInt(event.maxPlayers),
        gameType: event.gameType,
        createTime: db.serverDate(),
        openId: event.openId,
      }
    })
    return { code: 0, data: res }
  } catch (err) {
    return { code: -1, error: err }
  }
}