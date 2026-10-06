/** 后端 API 根地址，部署时改为实际域名并在微信公众平台配置 request 合法域名 */
const API_BASE = 'http://localhost:8080'

module.exports = {
  API_BASE,
  /** 客服会话 WebSocket（可选） */
  WS_CHAT: 'wss://api.example.com/ws/chat',
  /** 是否使用本地 Mock（无后端时可 true） */
  USE_MOCK: true,
  /** 转人工关键词阈值：连续无法理解次数 */
  HUMAN_HANDOFF_FAIL_COUNT: 3,
}
