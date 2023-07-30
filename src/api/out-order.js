import request from '@/utils/request'

/**
 *
 */
export function getChangeOrderList(params) {
  return request({
    url: 'Admin/OutOrder_OutOrderController.getsOutOrder',
    method: 'post',
    params
  })
}

export function addChangeOrder(params) {
  return request({
    url: 'Admin/OutOrder_OutOrderController.createOutOrder',
    method: 'post',
    params
  })
}

export function confirmOutOrder(params) {
  return request({
    url: 'Admin/OutOrder_OutOrderController.confirmOutOrder',
    method: 'post',
    params
  })
}
export function confWithdrawal(params) {
  return request({
    url: 'Admin/OutOrder_OutOrderController.confWithdrawal',
    method: 'post',
    params
  })
}


