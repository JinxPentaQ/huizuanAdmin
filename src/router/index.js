import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/collection',
    component: Layout,
    redirect: '/collection',
    name: 'Collection',
    meta: { title: '代收订单', icon: 'el-icon-folder-opened' },
    children: [
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/collection/index'),
        meta: { title: '全部订单', icon: 'el-icon-tickets' }
      }
      // {
      //   path: 'wait',
      //   name: 'wait',
      //   component: () => import('@/views/collection/wait-collect'),
      //   meta: {title: '待接订单', icon: 'el-icon-time'}
      // }
    ]
  },
  {
    path: '/out',
    component: Layout,
    redirect: '/out',
    name: 'out',
    meta: { title: '代付订单', icon: 'el-icon-collection' },
    children: [
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/out/out-order'),
        meta: { title: '全部订单', icon: 'el-icon-tickets' }
      },
      {
        path: 'config',
        name: '待确认订单',
        component: () => import('@/views/out/config-order'),
        meta: { title: '待确认订单', icon: 'el-icon-user' }
      }
      // {
      //   path: 'wait',
      //   name: 'wait',
      //   component: () => import('@/views/out/wait-out'),
      //   meta: {title: '待接订单', icon: 'el-icon-time'}
      // }
    ]
  },
  {
    path: '/payment',
    component: Layout,
    redirect: '/payment',
    name: 'payment',
    meta: { title: '充提管理', icon: 'el-icon-s-finance' },
    children: [
      {
        path: 'memberIncome',
        name: 'memberIncome',
        component: () => import('@/views/payment/member-income'),
        meta: { title: '会员充值', icon: 'el-icon-connection' }
      },
      {
        path: 'memberWithdraw',
        name: 'memberWithdraw',
        component: () => import('@/views/payment/member-withdraw'),
        meta: { title: '会员提现', icon: 'el-icon-coin' }
      },
      {
        path: 'platformIncome',
        name: 'platformIncome',
        component: () => import('@/views/payment/platform-withdraw'),
        meta: { title: '商户提现', icon: 'el-icon-wallet' }
      }
    ]
  },

  {
    path: '/personnel',
    component: Layout,
    redirect: '/personnel',
    name: 'Personnel',
    meta: { title: '会员管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/personnel/index'),
        meta: { title: '会员列表', icon: 'el-icon-user' }
      },
      {
        path: 'userLevel',
        name: 'userLevel',
        component: () => import('@/views/personnel/personnel_group.vue'),
        meta: { title: '会员层级', icon: 'el-icon-share' }
      },
      {
        path: 'collectInfo',
        name: 'collectInfo',
        component: () => import('@/views/collect-info/index'),
        meta: { title: '收款信息', icon: 'el-icon-s-finance' }
      }
    ]
  },
  {
    path: '/platform',
    component: Layout,
    redirect: '/platform',
    name: 'Platform',
    meta: { title: '商户管理', icon: 'el-icon-s-shop' },
    children: [
      {
        path: 'Platform',
        name: 'Platform',
        component: () => import('@/views/platform/index'),
        meta: { title: '商户列表', icon: 'el-icon-s-grid' }
      },
      // {
      //   path: 'Platform',
      //   name: 'Platform',
      //   component: () => import('@/views/platform/index'),
      //   meta: {title: '商户配置', icon: 'el-icon-s-grid'}
      // },
      {
        path: 'issued',
        name: 'issued',
        component: () => import('@/views/platform/issued.vue'),
        meta: { title: '下发订单', icon: 'el-icon-s-finance' }
      }

    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting',
    name: 'Setting',
    meta: { title: '系统管理', icon: 'el-icon-set-up' },
    children: [
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/setting/index'),
        meta: { title: '测试订单', icon: 'el-icon-setting' }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/setting/admin.vue'),
        meta: { title: '账户管理', icon: 'el-icon-monitor' }
      }
    ]
  },
  // {
  //   path: '/payment',
  //   component: Layout,
  //   redirect: '/payment',
  //   name: 'Payment',
  //   meta: {title: '出款', icon: 'el-icon-user-solid'},
  //   children: [
  //     {
  //       path: 'payment',
  //       name: '全部出款',
  //       component: () => import('@/views/out/index'),
  //       meta: {title: '全部订单', icon: 'el-icon-user'}
  //     },
  //     {
  //       path: 'config',
  //       name: '充值待确认订单',
  //       component: () => import('@/views/out/config-order'),
  //       meta: {title: '充值待确认订单', icon: 'el-icon-user'}
  //     },
  //     {
  //       path: 'change',
  //       name: '充值订单',
  //       component: () => import('@/views/out/change-order'),
  //       meta: {title: '充值订单', icon: 'el-icon-user'}
  //     },
  //     {
  //       path: 'out',
  //       name: '代付',
  //       component: () => import('@/views/out/out-order'),
  //       meta: {title: '代付订单', icon: 'el-icon-user'}
  //     },
  //     {
  //       path: 'businessOut',
  //       name: '商户提现',
  //       component: () => import('@/views/out/business-out-order'),
  //       meta: {title: '商户提现', icon: 'el-icon-user'}
  //     },
  //     {
  //       path: 'userOut',
  //       name: '用户提现',
  //       component: () => import('@/views/out/user-out-order'),
  //       meta: {title: '用户提现', icon: 'el-icon-user'}
  //     },
  //   ]
  // },
  // {
  //   path: '/report',
  //   component: Layout,
  //   redirect: '/report',
  //   name: 'Report',
  //   meta: {title: '报表管理', icon: 'el-icon-office-building'},
  //   children: [
  //     {
  //       path: 'report',
  //       name: 'All Report',
  //       component: () => import('@/views/report/index'),
  //       meta: {title: '总报表', icon: 'el-icon-notebook-1'}
  //     },
  //     {
  //       path: 'group',
  //       name: 'group',
  //       component: () => import('@/views/report/group-report'),
  //       meta: {title: '小组报表', icon: 'el-icon-notebook-2'}
  //     },
  //     {
  //       path: 'personal',
  //       name: 'personal',
  //       component: () => import('@/views/report/personal-report'),
  //       meta: {title: '个人报表', icon: 'el-icon-receiving'}
  //     }
  //   ]
  // },
  // {
  //   path: '/collect-info',
  //   component: Layout,
  //   redirect: '/collect-info',
  //   name: 'Collect-info',
  //   meta: {title: '收款信息管理', icon: 'el-icon-folder-add'},
  //   children: [
  //     {
  //       path: 'contract',
  //       name: 'All Contract',
  //       component: () => import('@/views/collect-info/index'),
  //       meta: {title: '收款信息', icon: 'el-icon-folder-checked'}
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
