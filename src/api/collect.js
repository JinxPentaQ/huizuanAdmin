import request from '@/utils/request'

/**
 *
 */
export function getsCollectOrder(params) {
  return request({
    url: 'Admin/CollectOrder_CollectOrderController.getsCollectOrder',
    method: 'post',
    params
  })
}

export function getCollectOrder(params) {
  return request({
    url: 'Admin/CollectOrder_CollectOrderController.getCollectOrder',
    method: 'post',
    params
  })
}


export function testCollectOrder(params) {
  return request({
    // url: 'Admin/CollectOrder_CollectOrderController.TestCollectOrder',
    url: 'Task/Api_ApiController.createCollectionOrder',
    method: 'post',
    params
  })
}

export function testOutOrder(params) {
  return request({
    // url: 'Admin/CollectOrder_CollectOrderController.TestOutOrder',
    url: 'Task/Api_ApiController.createPayOrder',
    method: 'post',
    params
  })
}
export function repairCollectOrder(params) {
  return request({
    // url: 'Admin/CollectOrder_CollectOrderController.TestOutOrder',
    url: 'Admin/CollectOrder_CollectOrderController.repairCollectOrder',
    method: 'post',
    params
  })
}
// http://ser.victorias-secret.club/Api_ApiController.createPayOrder?amount=20&sign=2&pay_type=1&platform_id=GP12339876fo&number=79122387643388213131&name=xaxx&organ=xaxx&address=7912&callback_url=7912%27
// $url = 'http://120.48.10.211:9002/Api_ApiController.createCollectionOrder?amount=' . $amount . '&sign=2&callback_url=2&platform_id=GP12339876fo';
