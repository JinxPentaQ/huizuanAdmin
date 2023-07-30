import request from '@/utils/request'

export function getsUserGroup(params) {
  return request({
    url: 'Admin/User_UserController.getsUserGroup',
    method: 'post',
    params
  })
}

export function addTopUser(params) {
  return request({
    url: 'Admin/User_UserController.addTopUser',
    method: 'post',
    params
  })
}
export function addUser(params) {
  return request({
    url: 'Admin/User_UserController.addUser',
    method: 'post',
    params
  })
}

export function modUserStatus(params) {
  return request({
    url: 'Admin/User_UserController.modUserStatus',
    method: 'post',
    params
  })
}

export function getUserList(params) {
  return request({
    url: 'Admin/User_UserController.getUserList',
    method: 'post',
    params
  })
}

export function getUserGroup(params) {
  return request({
    url: 'Admin/User_UserController.getGroupUser',
    method: 'post',
    params
  })
}