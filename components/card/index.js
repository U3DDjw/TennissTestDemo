Component({
  properties: {
    fileid: String,
    url: String,
    desc: String,
  },

   // 添加生命周期（关键修改点）
   lifetimes: {
    created() {
        // console.log('[card] created', {
        //     fileid: this.properties.fileid,
        //     url: this.properties.url,
        //     desc:this.properties.desc,
        //   })
    },
    attached() {
    //   console.log('[card] attached', {
    //     fileid: this.properties.fileid,
    //     url: this.properties.url,
    //     desc:this.properties.desc,
    //   })
      // 如果父组件初始化时已传入fileid，这里可以主动触发加载
      if (this.properties.fileid) {
        this.getCloudImage(this.properties.fileid)
      }
    }
  },
  observers: {
    // 监听fileid变化
    'fileid': function(fileid) {
      console.log("observers fileid", fileid)
      if (fileid) {
        this.getCloudImage(fileid);
      }
    }
  },
  data: {},
  methods: {
    // 获取云存储图片
    async getCloudImage(fileid) {
        //console.log("getCloudImage", fileid)
        try {
          const res = await wx.cloud.getTempFileURL({
            fileList: [fileid]
          });
          if (res.fileList[0] && res.fileList[0].tempFileURL) {
            this.setData({
              url: res.fileList[0].tempFileURL
            });
          }
        } catch (err) {
          console.error('获取云存储图片失败:', err);
          // 可以设置默认图片
          this.setData({
            url: '/static/default-image.png'
          });
        }
      },
    handleCardClick() {
      // 编码参数，确保URL安全
      const encodedDesc = encodeURIComponent(this.properties.desc || '');
      const encodedUrl = encodeURIComponent(this.properties.url || '');
      const fileIdUrl = encodeURIComponent(this.properties.fileid || '');
      wx.navigateTo({
        url: `/pages/activityDetailsPage/index?desc=${encodedDesc}&url=${encodedUrl}&fileid=${fileIdUrl}`,
        success: () => {
          console.log('跳转到详情页成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
        }
      });
    }
  }
});
