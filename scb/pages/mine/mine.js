const { getStoredUser, isLoggedIn, logout } = require('../../services/auth')
const chatService = require('../../services/chat')
const { DEFAULT_USER_AVATAR } = require('../../utils/constants')

Page({
  data: {
    user: {},
    loggedIn: false,
    defaultAvatar: DEFAULT_USER_AVATAR,
    showRate: false,
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const loggedIn = isLoggedIn()
    this.setData({
      loggedIn,
      user: loggedIn ? getStoredUser() || {} : {},
    })
  },

  onProfileTap() {
    if (!this.data.loggedIn) {
      wx.navigateTo({ url: '/pages/login/login?redirect=/pages/mine/mine' })
    }
  },

  go(e) {
    if (!isLoggedIn()) {
      wx.navigateTo({ url: '/pages/login/login?redirect=' + encodeURIComponent(e.currentTarget.dataset.url) })
      return
    }
    wx.navigateTo({ url: e.currentTarget.dataset.url })
  },

  goChat() {
    if (!isLoggedIn()) {
      wx.navigateTo({ url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/chat/index') })
      return
    }
    wx.switchTab({ url: '/pages/chat/index' })
  },

  rate() {
    this.setData({ showRate: true })
  },

  async onRateSubmit(e) {
    await chatService.submitSatisfaction({ sessionId: 'manual', ...e.detail })
    wx.showToast({ title: '已提交', icon: 'success' })
    this.setData({ showRate: false })
  },

  onRateClose() {
    this.setData({ showRate: false })
  },

  onLogout() {
    logout()
    getApp().globalData.userInfo = null
    this.refresh()
    wx.showToast({ title: '已退出', icon: 'none' })
  },
})
