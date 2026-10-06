Component({
  properties: {
    visible: { type: Boolean, value: false },
  },
  data: {
    score: 0,
    comment: '',
    tags: [],
    tagOptions: ['响应及时', '解答专业', '态度友好', '问题未解决', '等待过长'],
  },
  methods: {
    preventMove() {},
    onStar(e) {
      this.setData({ score: e.currentTarget.dataset.score })
    },
    onComment(e) {
      this.setData({ comment: e.detail.value })
    },
    onTag(e) {
      const tag = e.currentTarget.dataset.tag
      const tags = [...this.data.tags]
      const i = tags.indexOf(tag)
      if (i >= 0) tags.splice(i, 1)
      else tags.push(tag)
      this.setData({ tags })
    },
    onSkip() {
      this.triggerEvent('close', { skipped: true })
      this.reset()
    },
    onSubmit() {
      if (!this.data.score) {
        wx.showToast({ title: '请先打分', icon: 'none' })
        return
      }
      this.triggerEvent('submit', {
        score: this.data.score,
        comment: this.data.comment,
        tags: this.data.tags,
      })
      this.reset()
    },
    reset() {
      this.setData({ score: 0, comment: '', tags: [] })
    },
  },
})
