const { getStoredUser, isLoggedIn, wxLogin } = require('./services/auth')

App({
  onLaunch() {
    if (isLoggedIn()) {
      this.globalData.userInfo = getStoredUser()
    }
    wxLogin().catch(() => {})
  },
  globalData: {
    userInfo: null,
  },
})
