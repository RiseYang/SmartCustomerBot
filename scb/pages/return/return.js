const { applyReturn } = require('../../services/business')

Page({
  data: {
    loading: false,
    images: [],
    form: {
      orderId: '',
      type: 'return',
      reason: '',
    },
  },

  onField(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  onReturnType(e) {
    this.setData({ 'form.type': e.detail.value })
  },

  addImage() {
    wx.chooseMedia({
      count: 3 - this.data.images.length,
      mediaType: ['image'],
      success: (res) => {
        const paths = res.tempFiles.map((f) => f.tempFilePath)
        this.setData({ images: this.data.images.concat(paths) })
      },
    })
  },

  async submit() {
    const { orderId, reason } = this.data.form
    if (!orderId || !reason.trim()) {
      wx.showToast({ title: '请填写必填项', icon: 'none' })
      return
    }
    this.setData({ loading: true })
    try {
      const res = await applyReturn({
        ...this.data.form,
        images: this.data.images,
      })
      wx.showModal({
        title: '已受理',
        content: res.message || '工单已创建',
        showCancel: false,
      })
    } finally {
      this.setData({ loading: false })
    }
  },
})
