const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: 'user/purchase',
  cart: '/cart',
  productDetail: ':nameId'
} as const

export default path
