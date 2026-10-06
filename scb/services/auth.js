const { request } = require('./api')
const { USE_MOCK } = require('../config')

function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) resolve(res.code)
        else reject(new Error('wx.login 失败'))
      },
      fail: reject,
    })
  })
}

/** 登录：code + 可选手机号（需后端解密） */
async function login(payload = {}) {
  const code = payload.code || (await wxLogin())
  if (USE_MOCK) {
    const user = {
      id: 'u_mock_001',
      nickName: payload.nickName || '微信用户',
      avatarUrl: payload.avatarUrl || '',
      phone: payload.phone || '',
      token: 'mock_token_' + Date.now(),
    }
    wx.setStorageSync('token', user.token)
    wx.setStorageSync('userInfo', user)
    return user
  }
  const data = await request({
    url: '/auth/wx-login',
    method: 'POST',
    data: { code, ...payload },
  })
  if (data.token) wx.setStorageSync('token', data.token)
  if (data.user) wx.setStorageSync('userInfo', data.user)
  return data.user || data
}

/** 注册 / 完善资料 */
async function register(profile) {
  if (USE_MOCK) {
    const prev = wx.getStorageSync('userInfo') || {}
    const user = { ...prev, ...profile, registered: true }
    wx.setStorageSync('userInfo', user)
    return user
  }
  return request({
    url: '/auth/register',
    method: 'POST',
    data: profile,
  })
}

function logout() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
}

function getStoredUser() {
  return wx.getStorageSync('userInfo') || null
}

function isLoggedIn() {
  return !!wx.getStorageSync('token')
}

module.exports = {
  wxLogin,
  login,
  register,
  logout,
  getStoredUser,
  isLoggedIn,
}
