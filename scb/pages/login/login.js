const { login, register } = require('../../services/auth')
const { DEFAULT_USER_AVATAR } = require('../../utils/constants')

Page({
  data: {
    avatarUrl: DEFAULT_USER_AVATAR,
    nickName: '',
    phone: '',
    loading: false,
    redirect: '/pages/home/home',
  },

  onLoad(options) {
    if (options.redirect) {
      this.setData({ redirect: decodeURIComponent(options.redirect) })
    }
  },

  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl })
  },

  onNick(e) {
    this.setData({ nickName: e.detail.value })
  },

  onPhone(e) {
    this.setData({ phone: e.detail.value })
  },

  async onLogin() {
    if (!this.data.nickName.trim()) {
      wx.showToast({ title: '请填写昵称', icon: 'none' })
      return
    }
    this.setData({ loading: true })
    try {
      await login({
        nickName: this.data.nickName,
        avatarUrl: this.data.avatarUrl,
      })
      if (this.data.phone) {
        await register({ phone: this.data.phone })
      }
      const app = getApp()
      app.globalData.userInfo = wx.getStorageSync('userInfo')
      wx.showToast({ title: '登录成功', icon: 'success' })
      const url = this.data.redirect
      setTimeout(() => {
        if (url.includes('chat') || url.includes('home') || url.includes('mine')) {
          wx.switchTab({ url, fail: () => wx.reLaunch({ url }) })
        } else {
          wx.redirectTo({ url, fail: () => wx.switchTab({ url: '/pages/home/home' }) })
        }
      }, 400)
    } catch (e) {
      wx.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },
})
