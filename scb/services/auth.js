const db = require('./db')

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

function persistSession(user) {
  const token = 'scb_' + user.id
  wx.setStorageSync('token', token)
  wx.setStorageSync('userInfo', user)
  db.setCurrentUserId(user.id)
  return user
}

/** 登录：写入 scb_db.users，已存在则更新资料 */
async function login(payload = {}) {
  await wxLogin().catch(() => '')
  const user = db.upsertUser({
    nickName: payload.nickName,
    avatarUrl: payload.avatarUrl,
    phone: payload.phone,
  })
  return persistSession(user)
}

/** 注册 / 完善资料 */
async function register(profile) {
  const prev = wx.getStorageSync('userInfo') || {}
  const userId = prev.id || db.getCurrentUserId()
  let user = userId ? db.updateUser(userId, { ...profile, registered: true }) : null
  if (!user) {
    user = db.upsertUser({ ...prev, ...profile })
  }
  return persistSession(user)
}

function logout() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
  db.clearSessionAuth()
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
