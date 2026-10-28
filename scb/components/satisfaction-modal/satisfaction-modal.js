Component({
  properties: {
    visible: { type: Boolean, value: false },
  },
  data: {
    score: 0,
    comment: '',
    starList: [1, 2, 3, 4, 5],
    tagOptions: [
      { name: '响应及时', tone: 'good', selected: false },
      { name: '解答专业', tone: 'good', selected: false },
      { name: '态度友好', tone: 'good', selected: false },
      { name: '问题未解决', tone: 'bad', selected: false },
      { name: '等待过长', tone: 'bad', selected: false },
    ],
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
      const name = e.currentTarget.dataset.tag
      const tagOptions = this.data.tagOptions.map((item) => (
        item.name === name ? { ...item, selected: !item.selected } : item
      ))
      this.setData({ tagOptions })
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
        tags: this.data.tagOptions.filter((item) => item.selected).map((item) => item.name),
      })
      this.reset()
    },
    reset() {
      this.setData({
        score: 0,
        comment: '',
        tagOptions: this.data.tagOptions.map((item) => ({ ...item, selected: false })),
      })
    },
  },
})
