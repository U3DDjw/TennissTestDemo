Page({
    data: {
      activityDesc: '',
      activityUrl: '',
      activityTags: []
    },
  
    onLoad(options) {
      try {
        this.setData({
          activityDesc: decodeURIComponent(options.desc || ''),
          activityUrl: decodeURIComponent(options.url || ''),
          activityTags: JSON.parse(decodeURIComponent(options.tags || '[]'))
        });
      } catch (err) {
        console.error('参数解析错误:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    },

    // 提交按钮事件处理
    handleSubmit() {
      wx.showLoading({
        title: '提交中...',
        mask: true
      });

      // 模拟提交过程
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          success: () => {
            // 显示成功提示后关闭页面
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }
        });
      }, 1500);
    }
  });