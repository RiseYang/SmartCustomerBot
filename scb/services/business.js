const { request } = require('./api')

async function queryOrders(keyword) {
  const data = {}
  const kw = (keyword || '').trim()
  if (kw) data.keyword = kw
  return request({
    url: '/biz/orders',
    data,
  })
}

async function trackLogistics(orderId) {
  return request({
    url: '/biz/logistics/' + encodeURIComponent(orderId),
  })
}

async function applyInvoice(form) {
  return request({
    url: '/biz/invoice/apply',
    method: 'POST',
    data: form,
  })
}

async function applyReturn(form) {
  return request({
    url: '/biz/return/apply',
    method: 'POST',
    data: form,
  })
}

module.exports = {
  queryOrders,
  trackLogistics,
  applyInvoice,
  applyReturn,
}
