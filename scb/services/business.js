const db = require('./db')
const { getStoredUser } = require('./auth')

function currentUserId() {
  const user = getStoredUser()
  return (user && user.id) || db.getCurrentUserId()
}

async function queryOrders(keyword) {
  const list = db.queryOrders(currentUserId(), keyword)
  return { list }
}

async function trackLogistics(orderId) {
  const info = db.findLogistics(orderId)
  if (!info) return { error: '未找到物流信息' }
  return info
}

async function applyInvoice(form) {
  const row = db.insertInvoice(form)
  return { success: true, applyId: row.id, message: '发票申请已写入 scb_db，3 个工作日内开具' }
}

async function applyReturn(form) {
  const row = db.insertReturn(form)
  return { success: true, ticketId: row.id, message: '退换货申请已写入 scb_db，客服将联系您' }
}

module.exports = {
  queryOrders,
  trackLogistics,
  applyInvoice,
  applyReturn,
}
