// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('[cloud] 基础库版本过低，请使用 2.2.3 以上')
      return
    }

    wx.cloud.init({
      // 目前账号下只有一个环境（prod），可以省略 env，默认就用它。
      // 以后有第二个环境（比如 dev）时，这里必须写死环境 ID：
      // env: 'prod-1gxxxxxx',
      traceUser: true
    })

    console.log('[cloud] 云开发初始化完成')
  }
})
