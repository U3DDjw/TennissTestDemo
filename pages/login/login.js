Page({
  data: {
    agreed: false // 是否同意协议
  },

  // 用户协议选择变更
  onAgreementChange(e) {
    this.setData({
      agreed: e.detail.checked
    });
  },

  // 微信登录
  handleWechatLogin() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '登录中...',
    });

    // 调用微信登录接口
    wx.login({
      success: (res) => {
        console.log('[SUCCESS] 登录响应:', res);
        if (res.code) {
          // 这里替换为你的后端登录API
          wx.request({
            url: 'https://test.com/getUserInfo?id=1',
            method: 'POST',
            data: {
              code: res.code
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.success) {
                // 保存用户token
                wx.setStorageSync('token', res.data.token);
                // 跳转到首页
                wx.switchTab({
                  url: '/pages/home/index'
                });
              } else {
                wx.showToast({
                  title: res.data.message || '登录失败',
                  icon: 'none'
                });
              }
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              });
            }
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '获取登录凭证失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  }
});