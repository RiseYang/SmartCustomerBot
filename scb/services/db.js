/** 已停用。业务数据改由网关写入 MySQL scb_db，不要再把这里当数据源。 */
const DB_KEY = 'scb_db'
const OPENID_KEY = 'scb_openid'
const SESSION_USER_KEY = 'scb_current_user_id'

function nowStr() {
  const d = new Date()
  const p = (n) => (n < 10 ? '0' + n : '' + n)
  return (
    d.getFullYear() +
    '-' +
    p(d.getMonth() + 1) +
    '-' +
    p(d.getDate()) +
    ' ' +
    p(d.getHours()) +
    ':' +
    p(d.getMinutes())
  )
}

function uid(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
}

function seedOrders(userId) {
  return [
    {
      id: 'ORD20250928001',
      userId,
      title: '智能手环 Pro',
      amount: 299,
      status: 'shipped',
      statusText: '已发货',
      createdAt: '2025-09-25 10:20',
    },
    {
      id: 'ORD20250915002',
      userId,
      title: '无线耳机',
      amount: 159,
      status: 'completed',
      statusText: '已完成',
      createdAt: '2025-09-15 14:00',
    },
  ]
}

function seedLogistics(userId) {
  return [
    {
      id: 'LG_ORD20250928001',
      userId,
      orderId: 'ORD20250928001',
      company: '顺丰速运',
      trackingNo: 'SF1234567890',
      traces: [
        { time: '2025-09-28 09:00', desc: '快件已到达【北京朝阳集散中心】' },
        { time: '2025-09-27 18:30', desc: '快件已从【上海转运中心】发出' },
        { time: '2025-09-26 12:00', desc: '商家已发货' },
      ],
    },
  ]
}

function emptyDb() {
  return {
    name: 'scb_db',
    users: [],
    orders: [],
    logistics: [],
    invoices: [],
    returns: [],
    sessions: [],
    messages: [],
    satisfaction: [],
  }
}

function normalize(raw) {
  const base = emptyDb()
  if (!raw || typeof raw !== 'object') return base
  Object.keys(base).forEach((key) => {
    if (key === 'name') return
    if (Array.isArray(raw[key])) base[key] = raw[key]
  })
  base.name = 'scb_db'
  return base
}

function load() {
  try {
    return normalize(wx.getStorageSync(DB_KEY))
  } catch (e) {
    return emptyDb()
  }
}

function save(db) {
  wx.setStorageSync(DB_KEY, db)
  return db
}

function init() {
  const db = load()
  save(db)
  return db
}

function getOpenId() {
  let id = wx.getStorageSync(OPENID_KEY)
  if (!id || typeof id !== 'string') {
    id = uid('openid')
    wx.setStorageSync(OPENID_KEY, id)
  }
  return id
}

function setCurrentUserId(userId) {
  if (userId) wx.setStorageSync(SESSION_USER_KEY, userId)
  else wx.removeStorageSync(SESSION_USER_KEY)
}

function getCurrentUserId() {
  return wx.getStorageSync(SESSION_USER_KEY) || ''
}

function attachDemoBiz(db, userId) {
  if (db.orders.some((o) => o.userId === userId)) return
  const unassigned = db.orders.filter((o) => !o.userId)
  if (unassigned.length) {
    unassigned.forEach((o) => {
      o.userId = userId
    })
    db.logistics.forEach((l) => {
      if (!l.userId) l.userId = userId
    })
    return
  }
  seedOrders(userId).forEach((o) => db.orders.push(o))
  seedLogistics(userId).forEach((l) => db.logistics.push(l))
}

function upsertUser(profile) {
  const db = load()
  const openId = getOpenId()
  const nickName = (profile.nickName || '').trim() || '微信用户'
  const avatarUrl = typeof profile.avatarUrl === 'string' ? profile.avatarUrl : ''
  const phone = typeof profile.phone === 'string' ? profile.phone : ''
  let user = db.users.find((u) => u.openId === openId)
  const ts = nowStr()
  if (!user) {
    user = {
      id: uid('u'),
      openId,
      nickName,
      avatarUrl,
      phone,
      registered: !!phone,
      createdAt: ts,
      updatedAt: ts,
    }
    db.users.push(user)
    attachDemoBiz(db, user.id)
  } else {
    if (nickName) user.nickName = nickName
    if (avatarUrl) user.avatarUrl = avatarUrl
    if (phone) {
      user.phone = phone
      user.registered = true
    }
    user.updatedAt = ts
  }
  save(db)
  setCurrentUserId(user.id)
  return { ...user }
}

function updateUser(userId, patch) {
  const db = load()
  const user = db.users.find((u) => u.id === userId)
  if (!user) return null
  Object.keys(patch || {}).forEach((k) => {
    if (patch[k] !== undefined) user[k] = patch[k]
  })
  user.updatedAt = nowStr()
  save(db)
  setCurrentUserId(user.id)
  return { ...user }
}

function findUserById(userId) {
  return load().users.find((u) => u.id === userId) || null
}

function queryOrders(userId, keyword) {
  const db = load()
  const kw = (keyword || '').trim()
  return db.orders.filter((o) => {
    if (o.userId && userId && o.userId !== userId) return false
    if (!kw) return true
    return (o.id && o.id.indexOf(kw) >= 0) || (o.title && o.title.indexOf(kw) >= 0)
  })
}

function findLogistics(orderId) {
  const db = load()
  return db.logistics.find((l) => l.orderId === orderId) || null
}

function insertInvoice(doc) {
  const db = load()
  const row = {
    id: 'INV' + Date.now(),
    userId: getCurrentUserId(),
    createdAt: nowStr(),
    status: 'submitted',
    ...doc,
  }
  db.invoices.push(row)
  save(db)
  return row
}

function insertReturn(doc) {
  const db = load()
  const row = {
    id: 'RMA' + Date.now(),
    userId: getCurrentUserId(),
    createdAt: nowStr(),
    status: 'accepted',
    ...doc,
  }
  db.returns.push(row)
  save(db)
  return row
}

function createSession() {
  const db = load()
  const row = {
    id: 'sess_' + Date.now(),
    userId: getCurrentUserId(),
    context: { failCount: 0, lastIntent: null },
    humanMode: false,
    createdAt: nowStr(),
  }
  db.sessions.push(row)
  save(db)
  return row
}

function updateSession(sessionId, patch) {
  const db = load()
  const s = db.sessions.find((x) => x.id === sessionId)
  if (!s) return null
  Object.assign(s, patch)
  s.updatedAt = nowStr()
  save(db)
  return s
}

function insertMessage(sessionId, msg) {
  const db = load()
  const row = {
    id: uid('m'),
    sessionId,
    userId: getCurrentUserId(),
    createdAt: nowStr(),
    ...msg,
  }
  db.messages.push(row)
  save(db)
  return row
}

function insertSatisfaction(doc) {
  const db = load()
  const row = {
    id: uid('sat'),
    userId: getCurrentUserId(),
    createdAt: nowStr(),
    ...doc,
  }
  db.satisfaction.push(row)
  save(db)
  return row
}

function clearSessionAuth() {
  setCurrentUserId('')
}

module.exports = {
  DB_KEY,
  init,
  load,
  save,
  getOpenId,
  getCurrentUserId,
  setCurrentUserId,
  upsertUser,
  updateUser,
  findUserById,
  queryOrders,
  findLogistics,
  insertInvoice,
  insertReturn,
  createSession,
  updateSession,
  insertMessage,
  insertSatisfaction,
  clearSessionAuth,
  nowStr,
}
