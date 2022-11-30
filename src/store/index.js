import { createStore } from 'vuex';

import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    userAccount: '',
    userType: '',
    userToken: '',
    jwt: ''
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    updateUserAccount(state, payload) {
      state.userAccount = payload.value
    },
    updateUserType(state, payload) {
      state.userType = payload.value
    },
    updateUserToken(state, payload) {
      state.userToken = payload.value
    },
    updateJwt(state, payload) {
      state.jwt = payload.value
    },
  },
  actions: {},
  modules: {},
  plugins: [vuexLocal.plugin]
})
