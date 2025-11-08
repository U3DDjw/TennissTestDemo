// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    console.log("openid:",event.openId)
    try {
      // 根据openid查询用户数据
 const { data: user } = await db.collection('users').where({
      openId: event.openId
    }).get()

    if (user.length > 0) {
      return {
        code: 0,
        data: user[0] || null
      }
    }
    } catch (err) {
      return {
        code: -1,
        message: '查询失败',
        error: err
      }
    }
  }