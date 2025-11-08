
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const usersCollection = db.collection('users')
  const { openId, imageHeadFileId, nickName } = event

  try {
    // 检查用户是否存在
    const { data: user } = await usersCollection.where({
      openId: openId
    }).get()

    let result
    if (user.length > 0) {
      // 用户存在，更新信息
      result = await usersCollection.doc(user[0]._id).update({
        data: {
          imageHeadFileId: imageHeadFileId || '',
          nickName: nickName || '',
          updateTime: db.serverDate()
        }
      })
    } else {
      // 用户不存在，新增记录
      result = await usersCollection.add({
        data: {
          openId: openId,
          imageHeadFileId: imageHeadFileId || '',
          nickName: nickName || '',
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
    }

    return {
      code: 0,
      message: '操作成功',
      data: result
    }
  } catch (err) {
    console.error('更新用户信息失败:', err)
    return {
      code: -1,
      message: '操作失败',
      error: err
    }
  }
}