const { request } = require('./api')
const { USE_MOCK } = require('../config')

const MOCK_ORDERS = [
  {
    id: 'ORD20250928001',
    title: '智能手环 Pro',
    amount: 299,
    status: 'shipped',
    statusText: '已发货',
    createdAt: '2025-09-25 10:20',
  },
  {
    id: 'ORD20250915002',
    title: '无线耳机',
    amount: 159,
    status: 'completed',
    statusText: '已完成',
    createdAt: '2025-09-15 14:00',
  },
]

const MOCK_LOGISTICS = {
  ORD20250928001: {
    company: '顺丰速运',
    trackingNo: 'SF1234567890',
    traces: [
      { time: '2025-09-28 09:00', desc: '快件已到达【北京朝阳集散中心】' },
      { time: '2025-09-27 18:30', desc: '快件已从【上海转运中心】发出' },
      { time: '2025-09-26 12:00', desc: '商家已发货' },
    ],
  },
}

async function queryOrders(keyword) {
  if (USE_MOCK) {
    const list = MOCK_ORDERS.filter(
      (o) => !keyword || o.id.includes(keyword) || o.title.includes(keyword)
    )
    return { list }
  }
  return request({ url: '/biz/orders', data: { keyword } })
}

async function trackLogistics(orderId) {
  if (USE_MOCK) {
    const info = MOCK_LOGISTICS[orderId]
    if (!info) return { error: '未找到物流信息' }
    return info
  }
  return request({ url: `/biz/logistics/${orderId}` })
}

async function applyInvoice(form) {
  if (USE_MOCK) {
    return { success: true, applyId: 'INV' + Date.now(), message: '发票申请已提交，3 个工作日内开具' }
  }
  return request({ url: '/biz/invoice/apply', method: 'POST', data: form })
}

async function applyReturn(form) {
  if (USE_MOCK) {
    return { success: true, ticketId: 'RMA' + Date.now(), message: '退换货申请已受理，客服将联系您' }
  }
  return request({ url: '/biz/return/apply', method: 'POST', data: form })
}

module.exports = {
  queryOrders,
  trackLogistics,
  applyInvoice,
  applyReturn,
}
