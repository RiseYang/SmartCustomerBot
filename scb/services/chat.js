const { request } = require('./api')

async function sendMessage(payload) {
  return request({
    url: '/chat/message',
    method: 'POST',
    data: payload,
  })
}

async function createSession() {
  return request({
    url: '/chat/session',
    method: 'POST',
    data: {},
  })
}

async function handoff(payload) {
  return request({
    url: '/chat/handoff',
    method: 'POST',
    data: payload,
  })
}

async function submitSatisfaction(payload) {
  return request({
    url: '/chat/satisfaction',
    method: 'POST',
    data: payload,
  })
}

async function listSatisfaction() {
  return request({
    url: '/chat/satisfaction',
  })
}

module.exports = {
  sendMessage,
  createSession,
  handoff,
  submitSatisfaction,
  listSatisfaction,
}
