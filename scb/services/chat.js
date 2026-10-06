const { request } = require('./api')
const { USE_MOCK } = require('../config')

/** 消息类型：text | image | video | card | buttons | form | file | system */
const INTENTS = {
  ORDER: 'order_query',
  LOGISTICS: 'logistics',
  INVOICE: 'invoice',
  RETURN: 'return',
  HUMAN: 'human',
  GREET: 'greet',
  UNKNOWN: 'unknown',
  CLARIFY: 'clarify',
}

function detectIntent(text, context) {
  const t = (text || '').trim()
  if (!t) return { intent: INTENTS.UNKNOWN, confidence: 0 }
  if (/你好|您好|在吗|hello/i.test(t)) return { intent: INTENTS.GREET, confidence: 0.95 }
  if (/人工|转人工|客服|真人/.test(t)) return { intent: INTENTS.HUMAN, confidence: 0.99 }
  if (/订单|查单|我的订单/.test(t)) return { intent: INTENTS.ORDER, confidence: 0.9 }
  if (/物流|快递|到哪|运单/.test(t)) return { intent: INTENTS.LOGISTICS, confidence: 0.88 }
  if (/发票|开票|抬头/.test(t)) return { intent: INTENTS.INVOICE, confidence: 0.88 }
  if (/退货|换货|退款|售后/.test(t)) return { intent: INTENTS.RETURN, confidence: 0.88 }
  if (/它|那个|这个/.test(t) && context.lastIntent) {
    return { intent: context.lastIntent, confidence: 0.6, needClarify: true }
  }
  if (t.length <= 2) return { intent: INTENTS.UNKNOWN, confidence: 0.3, needClarify: true }
  return { intent: INTENTS.UNKNOWN, confidence: 0.4 }
}

function buildMockReply(userText, session) {
  const ctx = session.context || { failCount: 0, lastIntent: null }
  const { intent, confidence, needClarify } = detectIntent(userText, ctx)

  if (needClarify || (confidence < 0.5 && intent === INTENTS.UNKNOWN)) {
    ctx.failCount = (ctx.failCount || 0) + 1
    const replies = [
      {
        type: 'text',
        content: '想确认一下：您是想查订单、看物流，还是办理发票/退换货呢？',
      },
      {
        type: 'buttons',
        buttons: [
          { label: '查订单', action: 'intent:order_query' },
          { label: '查物流', action: 'intent:logistics' },
          { label: '开发票', action: 'intent:invoice' },
          { label: '退换货', action: 'intent:return' },
        ],
      },
    ]
    return {
      messages: replies,
      context: { ...ctx, lastIntent: intent },
      intentSummary: { intent: INTENTS.CLARIFY, userText },
    }
  }

  ctx.failCount = 0
  ctx.lastIntent = intent

  switch (intent) {
    case INTENTS.GREET:
      return {
        messages: [
          {
            type: 'text',
            content: '您好，我是智能客服小智，可帮您查订单、物流、发票与退换货。请问需要什么帮助？',
          },
          {
            type: 'card',
            title: '常用服务',
            desc: '点击下方快捷入口',
            items: [
              { name: '订单查询', path: '/pages/order/order' },
              { name: '物流跟踪', path: '/pages/logistics/logistics' },
              { name: '发票申请', path: '/pages/invoice/invoice' },
              { name: '退换货', path: '/pages/return/return' },
            ],
          },
        ],
        context: ctx,
        intentSummary: { intent, userText },
      }
    case INTENTS.ORDER:
      return {
        messages: [
          { type: 'text', content: '已为您打开订单查询。您也可以直接告诉我订单号。' },
          { type: 'buttons', buttons: [{ label: '去查订单', action: 'nav:/pages/order/order' }] },
        ],
        context: ctx,
        intentSummary: { intent, userText },
        proactive: '您最近有一笔订单 ORD20250928001 已发货，需要帮您查物流吗？',
      }
    case INTENTS.LOGISTICS:
      return {
        messages: [
          {
            type: 'text',
            content: '请提供订单号，或点击下方进入物流查询页。',
          },
          {
            type: 'image',
            url: 'https://mmbiz.qpic.cn/mmbiz_png/example_logistics.png',
            alt: '物流示意',
          },
          { type: 'buttons', buttons: [{ label: '物流查询', action: 'nav:/pages/logistics/logistics' }] },
        ],
        context: ctx,
        intentSummary: { intent, userText },
      }
    case INTENTS.INVOICE:
      return {
        messages: [
          { type: 'text', content: '发票支持电子增值税普通发票，请填写抬头与邮箱。' },
          {
            type: 'form',
            formId: 'invoice_quick',
            fields: [
              { key: 'orderId', label: '订单号', required: true },
              { key: 'title', label: '发票抬头', required: true },
              { key: 'email', label: '接收邮箱', required: true },
            ],
          },
          { type: 'buttons', buttons: [{ label: '完整发票页', action: 'nav:/pages/invoice/invoice' }] },
        ],
        context: ctx,
        intentSummary: { intent, userText },
      }
    case INTENTS.RETURN:
      return {
        messages: [
          {
            type: 'video',
            url: 'https://wxsample-video.example.com/return_guide.mp4',
            poster: '',
            title: '退换货流程说明',
          },
          { type: 'text', content: '请告知订单号与退换原因，或进入退换货页面提交。' },
          { type: 'buttons', buttons: [{ label: '申请退换货', action: 'nav:/pages/return/return' }] },
        ],
        context: ctx,
        intentSummary: { intent, userText },
      }
    case INTENTS.HUMAN:
      return {
        messages: [{ type: 'system', content: '正在为您转接人工客服，请稍候…' }],
        context: ctx,
        intentSummary: { intent, userText },
        handoff: true,
      }
    default:
      ctx.failCount = (ctx.failCount || 0) + 1
      return {
        messages: [
          {
            type: 'text',
            content: '这个问题我还不太确定，您可以换个说法，或输入「转人工」。',
          },
        ],
        context: ctx,
        intentSummary: { intent: INTENTS.UNKNOWN, userText },
      }
  }
}

/**
 * 发送用户消息，返回机器人回复列表
 * @param {{ sessionId, text, history, context, attachments? }} payload
 */
async function sendMessage(payload) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    const result = buildMockReply(payload.text, {
      context: payload.context || {},
    })
    if (result.proactive) {
      setTimeout(() => {}, 0)
    }
    return result
  }
  return request({
    url: '/chat/message',
    method: 'POST',
    data: payload,
  })
}

async function createSession() {
  if (USE_MOCK) {
    return { sessionId: 'sess_' + Date.now(), context: { failCount: 0 } }
  }
  return request({ url: '/chat/session', method: 'POST' })
}

async function handoffToHuman(payload) {
  if (USE_MOCK) {
    return { queueNo: 12, estimatedWait: '约 2 分钟', ticketId: 'HD' + Date.now() }
  }
  return request({
    url: '/chat/handoff',
    method: 'POST',
    data: payload,
  })
}

async function submitSatisfaction(payload) {
  if (USE_MOCK) {
    return { success: true }
  }
  return request({
    url: '/chat/satisfaction',
    method: 'POST',
    data: payload,
  })
}

module.exports = {
  INTENTS,
  sendMessage,
  createSession,
  handoffToHuman,
  submitSatisfaction,
}
