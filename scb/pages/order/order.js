const { queryOrders } = require('../../services/business')

Page({
  data: {
    keyword: '',
    list: [],
    loading: false,
  },

  onLoad(options) {
    if (options.keyword) this.setData({ keyword: options.keyword })
    this.search()
  },

  onKeyword(e) {
    this.setData({ keyword: e.detail.value })
  },

  async search() {
    this.setData({ loading: true })
    try {
      const res = await queryOrders(this.data.keyword.trim())
      this.setData({ list: res.list || [] })
    } catch (e) {
      wx.showToast({ title: (e && e.message) || '订单加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  goLogistics(e) {
    wx.navigateTo({ url: '/pages/logistics/logistics?orderId=' + e.currentTarget.dataset.id })
  },

  goInvoice(e) {
    wx.navigateTo({ url: '/pages/invoice/invoice?orderId=' + e.currentTarget.dataset.id })
  },
})
