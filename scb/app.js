const { getStoredUser, isLoggedIn, wxLogin } = require('./services/auth')
const db = require('./services/db')

App({
  onLaunch() {
    db.init()
    if (isLoggedIn()) {
      this.globalData.userInfo = getStoredUser()
    }
    wxLogin().catch(() => {})
  },
  globalData: {
    userInfo: null,
  },
})
