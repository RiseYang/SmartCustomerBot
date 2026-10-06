const chatService = require('../../services/chat')
const { getStoredUser, isLoggedIn } = require('../../services/auth')
const { DEFAULT_USER_AVATAR } = require('../../utils/constants')
const { HUMAN_HANDOFF_FAIL_COUNT } = require('../../config')

const CHAT_PAGE = '/pages/chat/index'

let msgSeq = 0
function nextId() {
  msgSeq += 1
  return msgSeq
}

Page({
  data: {
    messages: [],
    inputText: '',
    scrollIntoView: '',
    typing: false,
    sessionId: '',
    context: { failCount: 0 },
    intentTrail: [],
    humanMode: false,
    handoffInfo: {},
    showSatisfaction: false,
    userAvatar: DEFAULT_USER_AVATAR,
  },

  onLoad() {
    if (!isLoggedIn()) {
      wx.redirectTo({ url: '/pages/login/login?redirect=' + encodeURIComponent(CHAT_PAGE) })
      return
    }
    const user = getStoredUser()
    if (user && user.avatarUrl) {
      this.setData({ userAvatar: user.avatarUrl })
    }
    this.initSession()
  },

  endSession() {
    if (this.data.messages.length <= 1) {
      wx.showToast({ title: '暂无会话', icon: 'none' })
      return
    }
    this.setData({ showSatisfaction: true })
  },

  async initSession() {
    const { sessionId, context } = await chatService.createSession()
    this.setData({ sessionId, context: context || { failCount: 0 } })
    this.pushBot([
      { type: 'text', content: '您好，我是智能客服小智。可直接提问，或点下方快捷服务。' },
      {
        type: 'buttons',
        buttons: [
          { label: '查订单', action: 'intent:order_query' },
          { label: '查物流', action: 'intent:logistics' },
          { label: '转人工', action: 'intent:human' },
        ],
      },
    ])
  },

  pushUser(payload) {
    const id = nextId()
    const messages = this.data.messages.concat({
      id,
      fromUser: true,
      payload: typeof payload === 'string' ? { type: 'text', content: payload } : payload,
    })
    this.setData({ messages, scrollIntoView: `msg-${id}` })
  },

  pushBot(list) {
    const messages = [...this.data.messages]
    list.forEach((payload) => {
      const id = nextId()
      messages.push({ id, fromUser: false, payload })
    })
    const lastId = messages[messages.length - 1].id
    this.setData({ messages, scrollIntoView: `msg-${lastId}` })
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  async sendText() {
    const text = (this.data.inputText || '').trim()
    if (!text) return
    this.setData({ inputText: '' })
    await this.handleUserMessage(text)
  },

  async handleUserMessage(text, extra = {}) {
    this.pushUser(text)
    if (this.data.humanMode) {
      this.pushBot([{ type: 'system', content: '消息已同步至人工客服（演示模式）' }])
      return
    }

    this.setData({ typing: true })
    try {
      const history = this.data.messages.slice(-20).map((m) => ({
        role: m.fromUser ? 'user' : 'assistant',
        content: m.payload.content || m.payload.type,
      }))
      const res = await chatService.sendMessage({
        sessionId: this.data.sessionId,
        text,
        history,
        context: this.data.context,
        ...extra,
      })

      const ctx = res.context || this.data.context
      const trail = this.data.intentTrail.concat(res.intentSummary || [])
      this.setData({ context: ctx, intentTrail: trail })

      if (res.messages && res.messages.length) {
        this.pushBot(res.messages)
      }

      if (res.proactive) {
        setTimeout(() => {
          this.pushBot([{ type: 'text', content: res.proactive }])
        }, 800)
      }

      if (res.handoff) {
        await this.doHandoff()
      } else if ((ctx.failCount || 0) >= HUMAN_HANDOFF_FAIL_COUNT) {
        this.pushBot([
          { type: 'text', content: '多次未能理解您的问题，建议转接人工客服。' },
          { type: 'buttons', buttons: [{ label: '转人工', action: 'intent:human' }] },
        ])
      }
    } finally {
      this.setData({ typing: false })
    }
  },

  async doHandoff() {
    const summary = this.buildIntentSummary()
    const transcript = this.data.messages.map((m) => ({
      fromUser: m.fromUser,
      payload: m.payload,
    }))
    const info = await chatService.handoffToHuman({
      sessionId: this.data.sessionId,
      transcript,
      intentSummary: summary,
    })
    this.setData({ humanMode: true, handoffInfo: info })
    this.pushBot([
      {
        type: 'text',
        content: `已接入人工队列，${info.estimatedWait || ''}。工单号：${info.ticketId || '-'}`,
      },
    ])
  },

  buildIntentSummary() {
    const trail = this.data.intentTrail
    if (!trail.length) return '用户咨询一般问题'
    const last = trail[trail.length - 1]
    return `最近意图：${last.intent || 'unknown'}；末次表述：${last.userText || ''}`
  },

  onMessageAction(e) {
    const { type, path, intent } = e.detail
    if (type === 'nav' && path) {
      wx.navigateTo({ url: path })
      return
    }
    if (type === 'intent' && intent) {
      const textMap = {
        order_query: '我想查订单',
        logistics: '查物流',
        invoice: '开发票',
        return: '退换货',
        human: '转人工',
      }
      this.handleUserMessage(textMap[intent] || intent)
    }
  },

  onFormSubmit(e) {
    const { formId, values } = e.detail
    wx.showToast({ title: '已提交', icon: 'success' })
    this.pushUser({ type: 'text', content: `[表单 ${formId}] ${JSON.stringify(values)}` })
    this.pushBot([{ type: 'text', content: '已收到您的信息，我们会尽快处理。' }])
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const path = res.tempFiles[0].tempFilePath
        this.pushUser({ type: 'image', url: path })
        this.handleUserMessage('（用户发送图片）')
      },
    })
  },

  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      success: (res) => {
        const f = res.tempFiles[0]
        this.pushUser({ type: 'file', name: f.name })
        this.handleUserMessage('（用户上传文件：' + f.name + '）')
      },
    })
  },

  async onSatisfaction(e) {
    await chatService.submitSatisfaction({
      sessionId: this.data.sessionId,
      ...e.detail,
    })
    this.setData({ showSatisfaction: false })
    wx.showToast({ title: '感谢评价', icon: 'success' })
  },

  onSatisfactionClose() {
    this.setData({ showSatisfaction: false })
  },
})
