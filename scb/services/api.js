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
        const body = res.data
        const bizFail = body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'code') && body.code !== 0
        if (res.statusCode >= 200 && res.statusCode < 300 && !bizFail) {
          resolve(body)
          return
        }
        const message = (body && (body.message || body.msg)) || '请求失败'
        reject(Object.assign({}, body && typeof body === 'object' ? body : {}, { message }))
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

module.exports = { request, getToken }
