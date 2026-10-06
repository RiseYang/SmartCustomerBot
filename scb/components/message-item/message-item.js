const { BOT_AVATAR } = require('../../utils/constants')

Component({
  properties: {
    msg: { type: Object, value: {} },
    fromUser: { type: Boolean, value: false },
    userAvatar: { type: String, value: '' },
    botAvatar: { type: String, value: BOT_AVATAR },
  },
  data: {
    formValues: {},
  },
  methods: {
    onPreviewImage(e) {
      const url = e.currentTarget.dataset.url
      wx.previewImage({ urls: [url] })
    },
    onCardTap(e) {
      const path = e.currentTarget.dataset.path
      this.triggerEvent('action', { type: 'nav', path })
    },
    onButtonTap(e) {
      const action = e.currentTarget.dataset.action
      if (!action) return
      if (action.startsWith('nav:')) {
        this.triggerEvent('action', { type: 'nav', path: action.slice(4) })
      } else if (action.startsWith('intent:')) {
        this.triggerEvent('action', { type: 'intent', intent: action.slice(7) })
      } else {
        this.triggerEvent('action', { type: 'raw', action })
      }
    },
    onFormInput(e) {
      const key = e.currentTarget.dataset.key
      this.setData({ [`formValues.${key}`]: e.detail.value })
    },
    onFormSubmit(e) {
      const formId = e.currentTarget.dataset.formId
      this.triggerEvent('formsubmit', { formId, values: { ...this.data.formValues } })
    },
  },
})
