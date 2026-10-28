/** 后端 API 根地址，部署时改为实际域名并在微信公众平台配置 request 合法域名 */
const API_BASE = 'http://localhost:8080'

module.exports = {
  API_BASE,
  /** 客服会话 WebSocket（可选） */
  WS_CHAT: 'wss://api.example.com/ws/chat',
  /** 意图回复仍走本地规则；业务数据一律写入 scb_db */
  USE_MOCK: true,
  DB_NAME: 'scb_db',
  /** 转人工关键词阈值：连续无法理解次数 */
  HUMAN_HANDOFF_FAIL_COUNT: 3,
}
