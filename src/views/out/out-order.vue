<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        @change="handleFilter"
        class="filter-item"
        size="small"
      >
        <el-option
          v-for="item in orderOutStatusOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        class="filter-item-btn"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        size="small"
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
      key="order_no"
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
        minWidth="220px"
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
        minWidth="100px"
      />
      <el-table-column
        label="用户"
        prop="user_name"
        align="center"
        minWidth="100px"
      />
      <el-table-column
        label="订单金额"
        prop="order_amount"
        minWidth="150px"
        align="center"
      />
      <el-table-column
        label="手续费"
        prop="free"
        minWidth="150px"
        align="center"
      />
      <el-table-column
        label="成本"
        prop="cost_free"
        minWidth="150px"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="status"
        minWidth="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="支付类型"
        prop="pay_type"
        minWidth="150px"
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
        minWidth="190px"
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
        minWidth="80px"
      />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        minWidth="80px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
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
          <div class="detail-item-value">{{ detail.business_id }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">商户名称</div>
          <div class="detail-item-value">{{ detail.business_name }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">代付用户ID</div>
          <div class="detail-item-value">{{ detail.user_id }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">代付用户名称</div>
          <div class="detail-item-value">{{ detail.user_name }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">回调地址</div>
          <div class="detail-item-value">{{ detail.notice_url }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">备注</div>
          <div class="detail-item-value">{{ detail.remark }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">下单时间</div>
          <div class="detail-item-value">{{ detail.create_time }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getChangeOrderList } from "@/api/out-order";
import { getsUserGroup } from "@/api/user";
import {
  orderOutStatusOption,
  orderOutTypeOption,
  payTypeOption,
} from "@/utils/const";

const statusFilterKeyValue = orderOutStatusOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name;
  return acc;
}, {});

const typeFilterKeyValue = orderOutTypeOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name;
  return acc;
}, {});

const payTypeFilterKeyValue = payTypeOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name;
  return acc;
}, {});

export default {
  name: "OutOrder",
  // eslint-disable-next-line vue/no-unused-components
  components: { Pagination },
  filters: {
    statusFilter(key) {
      return statusFilterKeyValue[key];
    },
    typeFilter(key) {
      return typeFilterKeyValue[key];
    },
    payTypeFilter(key) {
      return payTypeFilterKeyValue[key];
    },
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        order_no: "",
        business_no: "",
        amount: "",
        order_fee: "",
        user_name: "",
        business_name: "",
        start_time: "",
        end_time: "",
        type: 2,
        page: 1,
        limit: 20,
      },
      userGroup: [],
      dialogFormVisible: false,
      detail: {},
      payTypeOption,
      orderOutStatusOption,
      orderOutTypeOption,
      refresh: 5,
      refreshTimer: null,
    };
  },
  created() {
    this.getList();
    this.getUserGroup();
    // 定时更新
    const sessionRefresh = (sessionStorage.getItem('outOrderRefresh') ||  this.refresh) * 1000;
    this.refreshTimer = setInterval(() => this.getList(), sessionRefresh);
    if(sessionStorage.getItem('outOrderRefresh')) {
      this.refresh = +sessionStorage.getItem('outOrderRefresh');
    }
  },
  beforeDestroy() {
    clearInterval(this.refreshTimer);
  },
  methods: {
    getList() {
      this.listLoading = true;
      getChangeOrderList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.allnum;
        this.listLoading = false;
      });
    },
    getUserGroup() {
      getsUserGroup().then((response) => {
        this.userGroup = response;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    checkboxT(row, rowIndex) {
      return true;
    },
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.detail = row;
    },
    // 更改定时刷新的数据
    onChangeRefresh() {
      sessionStorage.setItem('outOrderRefresh', this.refresh);
      clearInterval(this.refreshTimer);
      this.refreshTimer = setInterval(()=>this.getList(), this.refresh * 1000);
    }
  },
};
</script>
<style style="less" scoped>
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
</style>