import request from '@/utils/request'

/**
 * 获取收款信息
 */
export function getsCollectInfo(params) {
  return request({
    url: 'Admin/User_UserController.GetCollectInfoList',
    method: 'post',
    params
  })
}
/**
 * 获取收款信息
 */
export function setCollectInfoStatus(params) {
  return request({
    url: 'Admin/User_UserController.SetCollectInfoStatus',
    method: 'post',
    params
  })
}
