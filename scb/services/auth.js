const { request } = require('./api')

const OPENID_KEY = 'scb_openid'

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

/**
 * 未配置微信密钥时对应 sc_user.openid。
 * 固定为库里的演示用户，这样订单、物流和申请都落在同一条 MySQL 记录上。
 */
function getDevOpenId() {
  const id = 'mock_openid_001'
  wx.setStorageSync(OPENID_KEY, id)
  return id
}

function persistSession(token, user) {
  wx.setStorageSync('token', token)
  wx.setStorageSync('userInfo', user)
  return user
}

/** 登录：写入 MySQL sc_user，已存在则更新资料 */
async function login(payload = {}) {
  const code = await wxLogin().catch(() => '')
  const res = await request({
    url: '/auth/wx-login',
    method: 'POST',
    data: {
      code,
      devOpenId: getDevOpenId(),
      nickName: payload.nickName,
      avatarUrl: payload.avatarUrl,
      phone: payload.phone,
    },
  })
  if (!res || !res.token || !res.user) {
    throw new Error('登录响应无效')
  }
  return persistSession(res.token, res.user)
}

/** 注册 / 完善资料 */
async function register(profile) {
  const user = await request({
    url: '/auth/register',
    method: 'POST',
    data: profile,
  })
  const token = wx.getStorageSync('token')
  return persistSession(token, user)
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
  getDevOpenId,
}
