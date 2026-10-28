/** 网关地址。开发者工具需关闭「校验合法域名」，否则无法访问本机 HTTP。 */
const API_BASE = 'http://127.0.0.1:8089'

module.exports = {
  API_BASE,
  /** 客服会话 WebSocket（可选） */
  WS_CHAT: 'wss://api.example.com/ws/chat',
  /** 业务数据以 MySQL scb_db 为准，经网关读写 */
  USE_MOCK: false,
  DB_NAME: 'scb_db',
  /** 转人工关键词阈值：连续无法理解次数 */
  HUMAN_HANDOFF_FAIL_COUNT: 3,
}
