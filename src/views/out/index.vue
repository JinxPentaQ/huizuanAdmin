<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input
        v-model="listQuery.name"
        placeholder="姓名/手机号码"
        style="width: 200px;margin-left: 5px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-date-picker
        v-model="listQuery.start_time"
        value-format="timestamp"
        style="margin-left: 10px;width:150px;"
        placeholder="最近联系时间段"
      />

      <el-date-picker
        v-model="listQuery.end_time"
        value-format="timestamp"
        style="margin-left: 10px;width: 150px;"
        placeholder="最近联系时间段"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>


    </div>

    <div>
      <el-row :gutter="20">

        <el-col ref="class_customer_list" class="test" :span="6" :xs="24" style="width:100%;">

          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            row-key="id"
            border
            fit
            highlight-current-row
            style="margin-top: 5px"
          >
            <el-table-column
              type="selection"
              width="50"
              :selectable="checkboxT"
            />
            <el-table-column label="ID" prop="id" width="100px" align="center"/>
            <el-table-column label="订单编号" prop="order_no" width="200px" align="center"/>
            <el-table-column label="订单金额" prop="order_amount" width="150px" align="center"/>
            <el-table-column label="创建时间" prop="create_time" align="center" width="180px"/>
            <el-table-column label="状态" prop="status" align="center" width="100px">
              <template slot-scope="{row}">
                <el-tag>{{ row.status | statusFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="type" align="center" width="100px">
              <template slot-scope="{row}">
                <el-tag>{{ row.type | typeFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="接单用户" prop="user_name" align="center" width="100px"/>
            <el-table-column label="接单账户" prop="user_account" align="center" width="150px"/>
            <el-table-column label="收款名称" prop="pay_name" align="center" width="100px"/>
            <el-table-column label="收款账户" prop="pay_account" align="center" width="150px"/>
            <el-table-column label="收款备注" prop="pay_remark" align="center" width="100px"/>
            <el-table-column label="收款信息" prop="pay_info" align="center" width="180px"/>

          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />

        </el-col>

      </el-row>
    </div>

  </div>

</template>

<script>
import Pagination from '@/components/Pagination'
import {MessageBox} from 'element-ui'

import {
  getChangeOrderList
} from '@/api/out-order'
import {getsUserGroup} from '@/api/user'

const status = [
  {id: '1', name: '待接单'},
  {id: '2', name: '待付款'},
  {id: '3', name: '待确认'},
  {id: '4', name: '已确认'},
  {id: '5', name: '已取消'}
]

const typeStatus = [
  {id: '1', name: '充值'},
  {id: '2', name: '代付'},
  {id: '3', name: '商户提现'},
  {id: '4', name: '用户提现'}
]

const statusFilterKeyValue = status.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

const typeFilterKeyValue = typeStatus.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

export default {
  name: 'AllOrder',
  // eslint-disable-next-line vue/no-unused-components
  components: {Pagination},
  filters: {
    statusFilter(key) {
      return statusFilterKeyValue[key]
    },
    typeFilter(key) {
      return typeFilterKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        start_time: '',
        end_time: '',
        page: 1,
        limit: 20
      },
      userGroup: []
    }
  },
  created() {
    this.getList()
    this.getUserGroup()
  },
  methods: {
    getList() {
      this.listLoading = true
      getChangeOrderList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    getUserGroup() {
      getsUserGroup().then(response => {
        this.userGroup = response
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    checkboxT(row, rowIndex) {
      return true
    }
  }
}
</script>
