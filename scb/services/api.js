const { API_BASE } = require('../config')

function getToken() {
  return wx.getStorageSync('token') || ''
}

function request(options) {
  const { url, method = 'GET', data, header = {}, mock } = options
  if (mock) {
    return Promise.resolve(mock(data))
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: url.startsWith('http') ? url : `${API_BASE}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        Authorization: getToken() ? `Bearer ${getToken()}` : '',
        ...header,
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res.data || { message: '请求失败' })
        }
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

module.exports = { request, getToken }
