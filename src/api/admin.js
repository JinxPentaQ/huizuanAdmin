import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'Admin/Admin_AdminController.login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'Admin/Admin_AdminController.getInfo',
    method: 'post'
  })
}
export function addAdmin(params) {
  return request({
    url: 'Admin/Admin_AdminController.AddAdmin',
    method: 'post',
    params
  })
}
export function delAdmin(params) {
  return request({
    url: 'Admin/Admin_AdminController.DelAdmin',
    method: 'post',
    params
  })
}
export function getAdmin(params) {
  return request({
    url: 'Admin/Admin_AdminController.GetAdminList',
    method: 'post',
    params
  })
}
export function logout() {
  return request({
    url: 'Admin/Admin_AdminController.logout',
    method: 'post'
  })
}
export function getHomeData(params) {
  return request({
    url: 'Admin/Common_CommonController.GetHomeData',
    method: 'post',
    params
  })
}

// 绑定谷歌验证器
export function createGoogleAuth(params) {
  return request({
    url: 'Admin/Admin_AdminController.CreateGoogleAuthenticator',
    method: 'post',
    params
  })
}
// 修改密码
export function ModPwd(params) {
  return request({
    url: 'Admin/Admin_AdminController.ModPwd',
    method: 'post',
    params
  })
}

