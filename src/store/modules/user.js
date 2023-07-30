import {login, logout, getInfo} from '@/api/admin'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import {MessageBox} from 'element-ui'
import store from '@/store'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    status: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_STATUS: (state, status) => {
    state.status = status
  },
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password, code} = userInfo
    return new Promise((resolve, reject) => {
      login({admin_name: username.trim(), pwd: password, code }).then(response => {
        const {token, name, account, status, type, group_id, group_name, avatar} = response
        console.log(response)
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {account, id, name, status, token, type, desc} = response

        if (!id) {
          return reject('请重新登录')
        }

        commit('SET_NAME', name)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_STATUS', status)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    MessageBox.confirm('确认退出？', '退出', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      return new Promise((resolve, reject) => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
        // logout(state.token).then(() => {
        //   removeToken() // must remove  token  first
        //   resetRouter()
        //   commit('RESET_STATE')
        //   resolve()
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        }).catch(error => {
          reject(error)
        })
      // })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

