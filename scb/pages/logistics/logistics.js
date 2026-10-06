const { trackLogistics } = require('../../services/business')

Page({
  data: {
    orderId: 'ORD20250928001',
    info: null,
    error: '',
  },

  onLoad(options) {
    if (options.orderId) this.setData({ orderId: options.orderId })
    if (this.data.orderId) this.track()
  },

  onOrderId(e) {
    this.setData({ orderId: e.detail.value })
  },

  async track() {
    const orderId = this.data.orderId.trim()
    if (!orderId) {
      wx.showToast({ title: '请输入订单号', icon: 'none' })
      return
    }
    this.setData({ error: '', info: null })
    const res = await trackLogistics(orderId)
    if (res.error) {
      this.setData({ error: res.error })
      return
    }
    this.setData({ info: res })
  },
})
