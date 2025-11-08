import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

// 获取应用实例
const app = getApp()

Page({
  data: {
    enable: false,
    cardInfo: [],
    // 发布
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
  },
  // 生命周期
  async onReady() {
    try {
      const [matchesRes] = await Promise.all([
        wx.cloud.database().collection('matches').get()
      ]);
      
      // 将matches数据转换为cardInfo格式
      const matchesAsCards = matchesRes.data.map(match => ({
        desc: match.activityDetail || '暂无描述',
        fileid: match.cloudImageFileIds[0] || '/static/default-match.png',
        url:  '/static/default-match.png',
        testData:'xxxx'
      }));

      console.log("转换后的matches数据:", matchesAsCards);
      this.setData({
        cardInfo: [...matchesAsCards],
        focusCardInfo: [...matchesAsCards.slice(0, 2)],
      });
    } catch (err) {
      console.error("OnReady Home 数据获取失败:", err);
    }
  },
  onLoad(option) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    if (option.oper) {
      let content = '';
      if (option.oper === 'release') {
        content = '发布成功';
      } else if (option.oper === 'save') {
        content = '保存成功';
      }
      this.showOperMsg(content);
    }
  },
  onRefresh() {
    this.refresh();
  },
  async refresh() {
    this.setData({
      enable: true,
    });
    const [matchesRes] = await Promise.all([
        wx.cloud.database().collection('matches').get()
      ]);
      
      // 将matches数据转换为cardInfo格式
      const matchesAsCards = matchesRes.data.map(match => ({
        desc: match.activityDetail || '暂无描述',
        fileid: match.cloudImageFileIds[0] || '/static/default-match.png',
        url: '/static/default-match.png',
        testData:'xxxx',
      }));

    setTimeout(() => {
      this.setData({
        enable: false,
        cardInfo: matchesAsCards,
        focusCardInfo: matchesAsCards.slice(0, 2),
      });
    }, 1500);
  },
  showOperMsg(content) {
    Message.success({
      context: this,
      offset: [120, 32],
      duration: 4000,
      content,
    });
  },
  goRelease() {
    wx.navigateTo({
      url: '/pages/release/index',
    });
  },
});