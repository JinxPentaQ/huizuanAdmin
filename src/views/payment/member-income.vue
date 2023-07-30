<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-input
        v-model="listQuery.order_no"
        clearable
        placeholder="订单编号"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.amount"
        clearable
        placeholder="订单金额"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        class="filter-item"
        clearable
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in status"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <!-- <el-date-picker
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
      /> -->
      <el-button
        class="filter-item-btn"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="addChangeDialog()"
      >创建充值订单</el-button>
    </div>

    <div>
      <el-row :gutter="20">
        <el-col
          ref="class_customer_list"
          class="test"
          :span="6"
          :xs="24"
          style="width: 100%"
        >
          <el-table
            v-loading="listLoading"
            :data="list"
            row-key="id"
            border
            fit
            highlight-current-row
            style="margin-top: 5px"
          >
            <el-table-column
              label="订单编号"
              prop="order_no"
              min-width="200px"
              align="center"
            />
            <el-table-column
              label="订单金额"
              prop="order_amount"
              min-width="150px"
              align="center"
            />
            <el-table-column
              label="状态"
              prop="status"
              align="center"
              min-width="100px"
            >
              <template slot-scope="{ row }">
                <el-tag>{{ row.status | statusFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="充值用户"
              prop="user_name"
              align="center"
              min-width="100px"
            />
            <el-table-column
              label="充值账户"
              prop="user_account"
              align="center"
              min-width="150px"
            />
            <el-table-column
              label="创建时间"
              prop="create_time"
              align="center"
              min-width="180px"
            />
            <el-table-column
              label="更新时间"
              prop="update_time"
              align="left"
              min-width="190px"
            >
              <template slot-scope="{ row }">
                <div>
                  <div>创建: {{ row.create_time }}</div>
                  <div>完成: {{ row.finish_time }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="确认充值"
              align="center"
              width="80px"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row }">
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="row.status !== 3"
                  @click="handleConfirmDialog(row)"
                >
                  确认
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="'创建充值订单'" :visible.sync="dialogAddChangeVisible">
      <el-form
        ref="dataForm"
        :model="changeOrder"
        label-position="left"
        label-width="60px"
        style="width: 400px; margin-left: 50px"
      >
        <div style="width: auto">
          <el-form-item label="金额" prop="amount">
            <el-input
              v-model="changeOrder.amount"
              placeholder="金额"
              style="width: 200px; margin-left: 5px"
            />
          </el-form-item>
          <el-form-item label="所属组" prop="parent_id">
            <el-select
              v-model="changeOrder.parent_id"
              placeholder="所属组"
              style="width: 200px; margin-left: 5px"
              class="filter-item"
            >
              <el-option
                v-for="item in userGroup"
                :key="item.user_name"
                :label="item.user_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddChangeVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="addChangeOrder()"> 确认 </el-button>
      </div>
    </el-dialog>
    <!--   确认充值订单  -->
    <el-dialog
      :title="'确认充值订单'"
      :visible.sync="dialogConfigChangeVisible"
    >
      <el-form
        ref="dataForm"
        :model="confirmOrder"
        label-position="left"
        label-width="50px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="金额" prop="user_name">
          <el-input v-model="confirmOrder.order_amount" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="user_name">
          <el-input v-model="confirmOrder.user_name" disabled />
        </el-form-item>

        <el-form-item label="账户" prop="user_name">
          <el-input v-model="confirmOrder.user_account" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConfigChangeVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="configChangeOrder()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'
import {
  getChangeOrderList,
  addChangeOrder,
  confirmOutOrder
} from '@/api/out-order'
import { getsUserGroup } from '@/api/user'

const status = [
  { id: '1', name: '待接单' },
  { id: '2', name: '待付款' },
  { id: '3', name: '待确认' },
  { id: '4', name: '已确认' },
  { id: '5', name: '已取消' },
  { id: '6', name: '待审核' }
]

const typeStatus = [
  { id: '1', name: '充值' },
  { id: '2', name: '代付' },
  { id: '3', name: '商户提现' },
  { id: '4', name: '用户提现' }
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
  name: 'UserOutOrder',
  // eslint-disable-next-line vue/no-unused-components
  components: { Pagination },
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
        order_no: '',
        amount: '',
        status: '',
        start_time: '',
        end_time: '',
        type: 1,
        page: 1,
        limit: 20
      },
      userGroup: [],
      status,
      dialogAddChangeVisible: false,
      dialogConfigChangeVisible: false,
      changeOrder: {
        amount: undefined,
        parent_id: ''
      },
      confirmOrder: {}
    }
  },
  created() {
    this.getList()
    this.getUserGroup()
  },
  methods: {
    getList() {
      this.listLoading = true
      getChangeOrderList(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.allnum
        this.listLoading = false
      })
    },
    getUserGroup() {
      getsUserGroup().then((response) => {
        this.userGroup = response
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 天添加充值单弹窗
    addChangeDialog() {
      this.dialogAddChangeVisible = true
    },
    // 添加充值单
    addChangeOrder() {
      if (this.changeOrder.amount === '') {
        this.$message.error('请输入金额')
        return
      }
      if (this.changeOrder.parent_id === '') {
        this.$message.error('请选择团队')
        return
      }

      MessageBox.confirm('确认添加？', '添加', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogAddChangeVisible = false
        this.listLoading = true
        return new Promise((resolve, reject) => {
          addChangeOrder(this.changeOrder).then((response) => {
            this.listLoading = false
            this.getList()
          })
        })
      })
    },
    // 确认充值单弹窗
    handleConfirmDialog(row) {
      this.confirmOrder = row
      this.dialogConfigChangeVisible = true
    },
    // 确认充值单
    configChangeOrder() {
      this.listLoading = true
      this.dialogConfigChangeVisible = false
      MessageBox.confirm('确认收款？', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogConfigChangeVisible = false
        this.listLoading = true
        return new Promise((resolve, reject) => {
          confirmOutOrder({
            id: this.confirmOrder.id,
            status: 4
          })
            .then((response) => {
              this.listLoading = false
              this.getList()
            })
            .catch((error) => {
              this.listLoading = false
              console.log(error)
            })
        })
      })
    }

  }
}
</script>
<style  scoped>
.filter-item {
  width: 150px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.filter-item-btn {
  margin-left: 10px;
}
</style>
