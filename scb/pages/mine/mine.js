const { getStoredUser, isLoggedIn, logout } = require('../../services/auth')
const db = require('../../services/db')
const { DEFAULT_USER_AVATAR } = require('../../utils/constants')

Page({
  data: {
    user: {},
    loggedIn: false,
    defaultAvatar: DEFAULT_USER_AVATAR,
    showRateDetail: false,
    showRateList: false,
    satisfactionList: [],
    satisfaction: null,
    starList: [1, 2, 3, 4, 5],
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
    const userId = db.getCurrentUserId()
    const satisfactionList = userId
      ? db.load().satisfaction
          .filter((item) => item.userId === userId)
          .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      : []
    this.setData({ showRateList: true, satisfactionList })
  },

  openRateDetail(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.setData({
      satisfaction: this.data.satisfactionList[index] || null,
      showRateDetail: true,
    })
  },

  closeRateList() {
    this.setData({ showRateList: false })
  },

  closeRateDetail() {
    this.setData({ showRateDetail: false })
  },

  preventTap() {},

  onLogout() {
    logout()
    getApp().globalData.userInfo = null
    this.refresh()
    wx.showToast({ title: '已退出', icon: 'none' })
  },
})
