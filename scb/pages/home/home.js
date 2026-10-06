const { isLoggedIn } = require('../../services/auth')

Page({
  goChat() {
    if (!isLoggedIn()) {
      wx.navigateTo({ url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/chat/index') })
      return
    }
    wx.switchTab({ url: '/pages/chat/index' })
  },
  go(e) {
    if (!isLoggedIn()) {
      wx.navigateTo({
        url: '/pages/login/login?redirect=' + encodeURIComponent(e.currentTarget.dataset.url),
      })
      return
    }
    wx.navigateTo({ url: e.currentTarget.dataset.url })
  },
})
