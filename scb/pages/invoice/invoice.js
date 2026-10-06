const { applyInvoice } = require('../../services/business')

Page({
  data: {
    types: ['电子普通发票', '增值税专用发票'],
    typeIndex: 0,
    loading: false,
    form: {
      orderId: '',
      title: '',
      taxNo: '',
      email: '',
    },
  },

  onLoad(options) {
    if (options.orderId) {
      this.setData({ 'form.orderId': options.orderId })
    }
  },

  onField(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  onType(e) {
    this.setData({ typeIndex: Number(e.detail.value) })
  },

  async submit() {
    const { orderId, title, email } = this.data.form
    if (!orderId || !title || !email) {
      wx.showToast({ title: '请填写必填项', icon: 'none' })
      return
    }
    this.setData({ loading: true })
    try {
      const res = await applyInvoice({
        ...this.data.form,
        invoiceType: this.data.types[this.data.typeIndex],
      })
      wx.showModal({
        title: '提交成功',
        content: res.message || '申请已受理',
        showCancel: false,
      })
    } finally {
      this.setData({ loading: false })
    }
  },
})
