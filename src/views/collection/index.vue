<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-input
        v-model="listQuery.order_no"
        placeholder="订单编号"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.business_no"
        placeholder="商户编号"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.amount"
        placeholder="订单金额"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.order_fee"
        placeholder="手续费"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="成本"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.user_name"
        placeholder="用户"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.business_name"
        placeholder="商户"
        class="filter-item"
        clearable
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in platformOption"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        class="filter-item"
        clearable
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in orderStatusOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.pay_type"
        placeholder="支付类型"
        class="filter-item"
        clearable
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in payTypeOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <!-- <el-date-picker
        v-model="listQuery.date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker> -->

      <el-button
        class="filter-item-btn"
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <div class="refresh-content">
        <span>定时更新：</span>
        <el-radio-group v-model="refresh" @change="onChangeRefresh">
          <el-radio :label="5">5s</el-radio>
          <el-radio :label="10">10s</el-radio>
          <el-radio :label="20">20s</el-radio>
        </el-radio-group>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="订单编号"
        prop="order_no"
        min-width="200px"
        align="left"
      >
        <template slot-scope="{ row }">
          <div>
            <div>系统: {{ row.order_no }}</div>
            <div>商户: {{ row.business_no }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商户"
        prop="business_name"
        align="center"
        min-width="100px"
      />
      <el-table-column
        label="用户"
        prop="user_name"
        align="center"
        min-width="100px"
      />
      <el-table-column
        label="订单金额"
        prop="order_amount"
        min-width="150px"
        align="center"
      />
      <el-table-column
        label="手续费"
        prop="free"
        min-width="150px"
        align="center"
      />
      <el-table-column
        label="成本"
        prop="cost_free"
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
        label="支付类型"
        prop="pay_type"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.pay_type | payTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="最近更新时间"
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
        label="通知状态"
        prop="notify_status"
        align="center"
        min-width="80px"
      />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        min-width="80px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="getOrderInfo(row.id)">
            查看
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
    <!--详情-->
    <el-dialog title="详情" :visible.sync="dialogFormVisible" width="60%">

      <div v-if="detail.status==4" style="float:right;">
        <el-button type="primary" @click="repairCollectOrder(detail.id)">补单</el-button>
      </div>

      <el-divider content-position="left">订单明细</el-divider>
      <div class="detail-dialog-wrap">
        <div class="detail-item">
          <div class="detail-item-label">订单ID</div>
          <div class="detail-item-value">{{ detail.order_no }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">订单金额</div>
          <div class="detail-item-value">{{ detail.order_amount }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">成本</div>
          <div class="detail-item-value">{{ detail.cost_free }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">手续费</div>
          <div class="detail-item-value">{{ detail.free }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">支付状态</div>
          <div class="detail-item-value">
            {{ detail.status | statusFilter }}
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">支付类型</div>
          <div class="detail-item-value">
            {{ detail.pay_type | payTypeFilter }}
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">商户ID</div>
          <div class="detail-item-value">{{ detail.business_no }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">商户名称</div>
          <div class="detail-item-value">{{ detail.business_name }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">代收用户ID</div>
          <div class="detail-item-value">{{ detail.user_id }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">代收用户名称</div>
          <div class="detail-item-value">{{ detail.user_name }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">回调地址</div>
          <div class="detail-item-value">{{ detail.callback_url }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">下单时间</div>
          <div class="detail-item-value">{{ detail.create_time }}</div>
        </div>
      </div>
      <div v-if="detail.payInfo">
        <el-divider content-position="left">收款信息</el-divider>
        <div v-show="detail.pay_type === PAY_TYPE.BANK">
          <p>持卡人: {{ detail.payInfo.pay_name || '' }}</p>
          <p>银行名称:{{ detail.payInfo.pay_bank || '' }}</p>
          <p>开户行: {{ detail.payInfo.pay_bank_local || '' }}</p>
          <p>卡号:{{ detail.payInfo.pay_account || '' }}</p>
        </div>
        <el-image v-show="detail.pay_type !== PAY_TYPE.BANK" :src=" detail.payInfo.pay_bank_local">
          <div slot="placeholder" class="image-slot">
            加载中
            <span class="dot">...</span>
          </div>
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getsCollectOrder, getCollectOrder, repairCollectOrder } from '@/api/collect'
import Pagination from '@/components/Pagination'
import { orderStatusOption, payTypeOption } from '@/utils/const'
import { PAY_TYPE } from '@/utils/enum'
import { getsPlatform } from '@/api/platform'

const statusFilterKeyValue = orderStatusOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

const payTypeFilterKeyValue = payTypeOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

export default {
  name: 'Collect',
  components: { Pagination },
  filters: {
    statusFilter(key) {
      return statusFilterKeyValue[key]
    },
    payTypeFilter(key) {
      return payTypeFilterKeyValue[key]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        order_no: '',
        business_no: '',
        amount: '',
        order_fee: '',
        user_name: '',
        business_name: '',
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      dialogVisible: false,
      qrType: true,
      detail: {
        payInfo: {
          pay_name: '',
          pay_bank: '',
          pay_bank_local: '',
          pay_account: ''
        }
      },
      orderStatusOption,
      payTypeOption,
      PAY_TYPE,
      platformOption: [],
      refresh: 5,
      refreshTimer: null
    }
  },
  created() {
    this.getList()
    this.getPlatformList()
    // 定时更新
    const sessionRefresh = (sessionStorage.getItem('refresh') || this.refresh) * 1000
    this.refreshTimer = setInterval(() => this.getList(), sessionRefresh)
    if (sessionStorage.getItem('refresh')) {
      this.refresh = +sessionStorage.getItem('refresh')
    }
  },
  beforeDestroy() {
    clearInterval(this.refreshTimer)
  },
  methods: {
    // 列表
    getList() {
      this.listLoading = true
      getsCollectOrder(this.listQuery)
        .then((response) => {
          this.list = response.data
          this.total = response.allnum
          this.listLoading = false
        })
        .catch((error) => {
          console.log(error)
          this.listLoading = false
        })
    },
    // 查看详情
    getOrderInfo(id) {
      getCollectOrder({ id: id })
        .then((response) => {
          this.dialogFormVisible = true
          this.detail = response
          this.detail.payInfo = JSON.parse(response.pay_info)
        })
    },
    // 筛选
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 获取商户列表
    getPlatformList() {
      getsPlatform({
        page: 1,
        limit: 50,
        type: undefined,
        status: undefined
      }).then((response) => {
        this.platformOption = response.data
      })
    },
    // 补单
    repairCollectOrder(id) {
      repairCollectOrder({
        id: id
      }).then((response) => {
        this.dialogFormVisible = false
        this.getList()
      })
    },
    // 更改定时刷新的数据
    onChangeRefresh() {
      sessionStorage.setItem('refresh', this.refresh)
      clearInterval(this.refreshTimer)
      this.refreshTimer = setInterval(() => this.getList(), this.refresh * 1000)
    }
  }

}
</script>
<style style="scss" scoped>
.filter-item {
  width: 150px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.filter-item-btn {
  margin-left: 10px;
}

.detail-dialog-wrap {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.detail-item {
  width: 50%;
  padding: 10px;
}

.detail-item-label {
  width: 150px;
  margin-bottom: 10px;
  color: #909399;
  font-weight: 600;
  font-size: 12px;
}

.detail-item-value {
  color: #606266;
  font-size: 14px;
}

/deep/ .el-dialog__body {
  padding: 0 20px 20px 20px;

}

.el-image {
  width: 300px;
  height: auto;
}
</style>
