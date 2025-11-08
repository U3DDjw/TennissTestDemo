// app.js
import config from './config';
import Mock from './mock/index';
import createBus from './utils/eventBus';

if (config.isMock) {
  Mock();
}

App({
  onLaunch() {
     // 开启调试模式（仅开发版生效）
     wx.setEnableDebug({
        enableDebug: true
      });
      
      // 错误监控
      wx.onError(error => {
        console.error('全局捕获错误:', error);
      });
    
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            console.log('wx cloud init startsxxx', wx.cloud);
            this.globalData = {}

            wx.cloud.init({
            // env 参数说明：
            //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
            //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
            //   如不填则使用默认环境（第一个创建的环境）
            env: 'cloud1-4ggx5hab065df4bf',
            traceUser: true,
            })

            // 调用获取OpenId的云函数
            wx.cloud.callFunction({
              name: 'getOpenId',
              success: res => {
                console.log('[云函数] [getOpenId] 调用成功', res.result)
                console.log('用户OpenId:', res.result.openid)
                this.globalData.openid = res.result.openid
              },
              fail: err => {
                console.error('[云函数] [getOpenId] 调用失败', err)
              }
            })
        }
   

    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      // console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });
  },
  globalData: {
    userInfo: null,
  },

  /** 全局事件总线 */
  eventBus: createBus(),
});