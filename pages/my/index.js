import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';

Page({
  behaviors: [useToastBehavior],

  data: {
    imageHeadFileId: '',
    avatarUrl: '/static/avatar1.png',
    nickName: '小网',
    curOpenId:'',
    isAdjustedNickName: false,
    isAdjustedImageHead: false,
  },

  async onLoad() {
      const app = getApp()
      this.setData({curOpenId: app.globalData.openid})
      console.log("my onLoad", this.data.curOpenId)
      // 根据openid查询用户数据
      const { result } = await wx.cloud.callFunction({
        name: 'getUserByOpenId',
        data: {
          openId: this.data.curOpenId
        }
      })
      if (result.code === 0) {
        console.log("my onLoad result.data", result.data)
        this.setData({
          imageHeadFileId: result.data.imageHeadFileId || '',
          nickName: result.data.nickName || '',
          // 获取根据imageHeadFileiIdavatarUrl
        })
        this.downloadImageFromCloud()
       
      } else {
        throw new Error(result.message || '获取用户数据失败')
      }
    this.refreshAdjustStatus();
    console.log("my onLoad data", this.data);
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    console.log("onChooseAvatar uploadfile avatarUrl", avatarUrl);

   // 生成唯一的云存储路径
  const cloudPath = `user-avatars/${this.data.curOpenId}.jpg`;
  // 上传图片到云存储
  wx.cloud.uploadFile({
    cloudPath: cloudPath,  // 云存储路径
    filePath: avatarUrl,  // 临时文件路径
    success: (res) => {
     console.log("onChooseAvatar uploadfile res", res.fileID);
      // 上传成功，获取文件ID
      const fileID = res.fileID;
      // 更新页面数据
      this.setData({
        imageHeadFileId: fileID       // 云存储文件ID
      });
      // 调用保存用户信息方法
      this.saveUserInfo();
    },
    fail: (err) => {
      // 显示错误提示
      wx.showToast({
        title: '头像上传失败',
        icon: 'none'
      });
      
      console.error('头像上传失败:', err);
    }
  });
    this.saveUserInfo()
    this.refreshAdjustStatus()
  },
   // 新增昵称输入回调
   onNicknameInput: function(e) {
    console.log('输入的昵称:', e.detail.value);
    // 这里可以处理昵称输入后的逻辑
    this.setData({
        nickName: e.detail.value
    });
    this.saveUserInfo()
    this.refreshAdjustStatus()
  },

  onNavigateTo() {
    wx.navigateTo({ url: `/pages/my/info-edit/index` });
  },

  refreshAdjustStatus() {
    const adjustName = this.data.nickName != "小网"
    const adjustHeadImage = this.data.avatarUrl != "/static/avatar1.png"
    this.setData({
        isAdjustedNickName:adjustName,
        isAdjustedImageHead:adjustHeadImage,
    })
  },
  
  async saveUserInfo() {
    try {
        const curImageHeadFileId = this.data.imageHeadFileId || 'noneFileId';
        const curNickName = this.data.nickName || 'defaultName';
        console.log("saveUserInfo Data", this.data.curOpenId, curImageHeadFileId, curNickName)
        const res = await wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: {
          openId: this.data.curOpenId,
          imageHeadFileId: curImageHeadFileId,
          nickName: curNickName
        }
      })
      console.log("updateUserInfo result code", res.result.code)
      if (res.result.code === 0) {
        wx.showToast({ title: '保存成功', icon: 'success' })
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' })
      }
    } catch (err) {
      console.error('保存失败:', err)
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  async  downloadImageFromCloud() {
    const fileID = this.data.imageHeadFileId
    try {
      // 步骤1: 检查fileID有效性
      if (!fileID || typeof fileID !== 'string') {
        throw new Error('无效的fileID')
      }
  
      // 步骤2: 显示加载状态
      wx.showLoading({
        title: '图片加载中...',
        mask: true
      })
  
      // 步骤3: 调用云存储下载API
      const { tempFilePath } = await wx.cloud.downloadFile({
        fileID: fileID
      })
  
      // 步骤4: 下载完成，隐藏加载状态
      wx.hideLoading()
      this.setData({
        avatarUrl: tempFilePath || '',
      })
      // 步骤5: 返回临时文件路径
      return tempFilePath
  
    } catch (error) {
      // 错误处理
      wx.hideLoading()
      console.error('图片下载失败:', error)
      wx.showToast({
        title: '图片加载失败',
        icon: 'none'
      })
      throw error // 可以选择继续抛出或返回null
    }
  },
  
});