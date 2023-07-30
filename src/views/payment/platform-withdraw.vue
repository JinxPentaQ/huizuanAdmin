<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-input
        v-model="listQuery.order_no"
        placeholder="订单编号"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.amount"
        placeholder="订单金额"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        class="filter-item"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in status"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
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
        @click="handleFilter"
      >
        搜索
      </el-button>
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
              minWidth="200px"
              align="center"
            />
            <el-table-column
              label="订单金额"
              prop="order_amount"
              minWidth="150px"
              align="center"
            />
            <el-table-column
              label="状态"
              prop="status"
              align="center"
              minWidth="100px"
            >
              <template slot-scope="{ row }">
                <el-tag>{{ row.status | statusFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="提现商户"
              prop="pay_name"
              align="center"
              minWidth="100px"
            />
            <el-table-column
              label="提现账户"
              prop="pay_account"
              align="center"
              minWidth="100px"
            />
            <el-table-column
              label="备注"
              prop="pay_remark"
              align="center"
              minWidth="100px"
            />
            <!-- <el-table-column label="收款名称" prop="pay_name" align="center" minWidth="100px"/>
            <el-table-column label="收款账户" prop="pay_account" align="center" minWidth="100px"/>
            <el-table-column label="收款备注" prop="pay_remark" align="center" minWidth="100px"/>
            <el-table-column label="收款信息" prop="pay_info" align="center" minWidth="180px"/> -->
            <el-table-column
              label="创建时间"
              prop="create_time"
              align="center"
              minWidth="180px"
            />
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              minWidth="100px"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row }">
                <el-button
                  v-show="row.status === 6"
                  type="primary"
                  size="mini"
                  @click="handleVerify(row, 1)"
                >
                  通过
                </el-button>
                <el-button
                  v-show="row.status === 6"
                  size="mini"
                  type="danger"
                  @click="handleVerify(row, 0)"
                >
                  拒绝
                </el-button>
                <el-button type="primary" size="mini" @click="handleInfo(row)">
                  收款信息
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
import Pagination from "@/components/Pagination";
import { MessageBox } from "element-ui";

import { getChangeOrderList, confWithdrawal } from "@/api/out-order";
import { getsUserGroup } from "@/api/user";

const status = [
  { id: "1", name: "待接单" },
  { id: "2", name: "待付款" },
  { id: "3", name: "待确认" },
  { id: "4", name: "已确认" },
  { id: "5", name: "已取消" },
  { id: "6", name: "待审核" },
];

const typeStatus = [
  { id: "1", name: "充值" },
  { id: "2", name: "代付" },
  { id: "3", name: "商户提现" },
  { id: "4", name: "用户提现" },
];

const statusFilterKeyValue = status.reduce((acc, cur) => {
  acc[cur.id] = cur.name;
  return acc;
}, {});

const typeFilterKeyValue = typeStatus.reduce((acc, cur) => {
  acc[cur.id] = cur.name;
  return acc;
}, {});

export default {
  name: "UserOutOrder",
  // eslint-disable-next-line vue/no-unused-components
  components: { Pagination },
  filters: {
    statusFilter(key) {
      return statusFilterKeyValue[key];
    },
    typeFilter(key) {
      return typeFilterKeyValue[key];
    },
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        order_no: "",
        amount: "",
        status: "",
        start_time: "",
        end_time: "",
        type: 3,
        page: 1,
        limit: 20,
      },
      userGroup: [],
      status,
      dialogVisible: false,
      detail: {
        pay_info: {
          pay_account: '',
        }
      },
    };
  },
  created() {
    this.getList();
    this.getUserGroup();
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
    // 提现审核
    handleVerify(row, status) {
      MessageBox.confirm(
        status ? "确认通过当前提现？" : "确认拒绝当前提现",
        "确认",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.dialogConfigChangeVisible = false;
        this.listLoading = true;
        return new Promise((resolve, reject) => {
          confWithdrawal({ id: row.id, status: status })
            .then((response) => {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            })
            .catch((error) => {
              this.listLoading = false;
              console.log(error);
            });
        });
      });
    },
     // 查看收款信息
    handleInfo(row) {
      this.dialogVisible = true;
      this.detail = row;
      this.detail.pay_info = row.pay_info ? JSON.parse(row.pay_info) : {};
    },
  },
};
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