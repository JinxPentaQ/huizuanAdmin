<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-input
        v-model="listQuery.user_id"
        placeholder="用户id"
        style="width: 200px; margin-left: 5px"
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
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        class="filter-item"
        clearable
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in type"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
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
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="名称"
        prop="user_name"
        min-width="100px"
        align="center"
      />
      <el-table-column
        label="账户"
        prop="user_account"
        min-width="150px"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="status"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        prop="type"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="收款姓名"
        prop="user_name"
        min-width="150px"
        align="center"
      />
      <el-table-column
        label="收款信息"
        prop="pay_info"
        align="center"
        width="150px"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            circle
            @click="handleInfo(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        prop="create_time"
        align="center"
        min-width="200px"
      />
      <!-- <el-table-column
        label="备注"
        prop="remark"
        align="center"
        minWidth="150px"
      /> -->
      <el-table-column
        label="审核"
        align="center"
        min-width="200px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            :disabled="row.status !== 2"
            type="primary"
            size="mini"
            @click="codePass(row, 1)"
          >
            通过
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="codePass(row, 0)"
          >
            删除
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
    <!-- 收款信息 -->
    <el-dialog title="收款信息" :visible.sync="dialogVisible" width="30%">
      <div v-if="detail.pay_info.pay_account">
        <p>持卡人: {{ detail.pay_info.pay_name }}</p>
        <p>银行名称:{{ detail.pay_info.pay_bank }}</p>
        <p>开户行: {{ detail.pay_info.pay_bank_local }}</p>
        <p>卡号:{{ detail.pay_info.pay_account }}</p>
      </div>
      <el-image v-else :src="detail.pay_info && detail.pay_info.pay_bank_local">
        <div slot="placeholder" class="image-slot">
          加载中
          <span class="dot">...</span>
        </div>
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getsCollectInfo, setCollectInfoStatus } from '@/api/collect-info'
import { MessageBox } from 'element-ui'

const status = [
  { id: '0', name: '删除' },
  { id: '1', name: '正常' },
  { id: '2', name: '待审核' }
]

const type = [
  { id: '1', name: '银行卡' },
  { id: '2', name: '微信' },
  { id: '3', name: '支付宝' },
  { id: '4', name: 'USDT' }
]

const statusFilterKeyValue = status.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

const typeFilterKeyValue = type.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

export default {
  name: 'Resource',
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
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        type: undefined,
        status: undefined,
        user_id: ''
      },
      dialogVisible: false,
      detail: {
        pay_info: {
          pay_account: ''
        }
      },
      status,
      type
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getsCollectInfo(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    codePass(row, status) {
      MessageBox.confirm('是否审核此条？', '操作', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setCollectInfoStatus({ id: row.id, status }).then((response) => {
          this.getList()
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 查看收款信息
    handleInfo(row) {
      this.dialogVisible = true
      this.detail = row
      this.detail.pay_info = row.pay_info ? JSON.parse(row.pay_info) : {}
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
