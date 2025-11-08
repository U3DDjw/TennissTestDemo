// pages/release/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: '活动详情',
    maxPlayers: '4',
    gameType: 'single',
    originFiles: [],
    cloudImageFileIds: [],
    gridConfig: {
      column: 4,
      width: 160,
      height: 160
    }
  },

  onLoad() {
    console.log('方法是否存在:', typeof this.onDetailChange)
  },

  async handleSuccess(e) {
    const { files } = e.detail;
    console.log("handleSuccess", files);
    
    this.setData({
      originFiles: files,
    });

    wx.showLoading({
      title: '图片上传中...',
      mask: true
    });

    try {
      const cloudFileIds = [];
      for (const file of files) {
        console.log("handleSuccessxxx", file.name);

        const res = await wx.cloud.uploadFile({
          cloudPath: `match_images/${file.name.split('.')[0]}-${Date.now()}.${file.name.split('.').pop()}`,
          filePath: file.url
        });
        cloudFileIds.push(res.fileID);
      }

      this.setData({
        cloudImageFileIds:cloudFileIds
      });

      wx.hideLoading();
      wx.showToast({
        title: '图片上传成功',
        icon: 'success'
      });

    } catch (err) {
      wx.hideLoading();
      console.error('图片上传失败:', err);
      wx.showToast({
        title: '图片上传失败',
        icon: 'none'
      });
    }
  },
  async handleRemove(e) {
    const { index } = e.detail;
    const { originFiles, cloudImageFileIds } = this.data;
    
    wx.showLoading({
      title: '删除中...',
      mask: true
    });

    try {
      // 删除云存储文件
      if (cloudImageFileIds[index]) {
        await wx.cloud.deleteFile({
          fileList: [cloudImageFileIds[index]]
        });
        cloudImageFileIds.splice(index, 1);
      }

      // 删除本地记录
      originFiles.splice(index, 1);
      
      this.setData({
        originFiles,
        cloudImageFileIds
      });

      wx.hideLoading();
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });

    } catch (err) {
      wx.hideLoading();
      console.error('删除失败:', err);
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  },
  
  gotoMap() {
    wx.showToast({
      title: '获取当前位置...',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false,
      success: () => {},
      fail: () => {},
      complete: () => {},
    });
  },

  onDetailChange(e) {
    console.log("onDetailChange",e.detail.value)
    this.setData({
      activityDetail: e.detail.value
    });
  },

  onMaxPlayersChange(e) {
    console.log("onMaxPlayersChange",e.detail.value)
    this.setData({
      maxPlayers: e.detail.value
    });
  },

  onGameTypeChange(e) {
    console.log("onGameTypeChange",e.detail.value)
    this.setData({
      gameType: e.detail.value
    });
  },
  
  async release() {
    // 表单验证
    if (!this.data.activityDetail) {
      wx.showToast({
        title: '请填写活动详情',
        icon: 'none'
      });
      return;
    }
    if (!this.data.maxPlayers) {
      wx.showToast({
        title: '请填写人数限制',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '发布中...',
      mask: true
    });

    try {
      // 收集核心表单数据
      const matchData = {
        activityDetail: this.data.activityDetail,
        cloudImageFileIds:this.data.cloudImageFileIds,
        maxPlayers: this.data.maxPlayers,
        gameType: this.data.gameType,
        openId: getApp().globalData.openid || "errorOpenId"
      };
      console.log("Send MatchData", matchData)
      // 调用云函数
      const res = await wx.cloud.callFunction({
        name: 'addMatch',
        data: matchData
      });

      wx.cloud.uploadFile({
        cloudPath: 'example.png',
        filePath: '', // 文件路径
        success: res => {
          // get resource ID
          console.log(res.fileID)
        },
        fail: err => {
          // handle error
        }
      })

      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });

      // 0.5秒后关闭页面
      setTimeout(() => {
        wx.navigateBack();
      }, 500);

    } catch (err) {
      wx.hideLoading();
      console.error('发布失败:', err);
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      });
    }
  },
});