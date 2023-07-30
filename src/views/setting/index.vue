<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-input class="filter-item" placeholder="测试商户" disabled />
      <el-input
        v-model="Collect.amount"
        placeholder="金额"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="Collect.pay_type"
        placeholder="支付方式"
        class="filter-item"
      >
        <el-option
          v-for="item in payTypeOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        class="filter-item-btn"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="testCollect"
      >
        测试代收下单
      </el-button>
      <el-card v-if="collect.order_no" class="link-wrap">
        <div>订单ID: {{ collect.order_no }}</div>
        <div>链接： {{ collect.show_page || "-" }}</div>
      </el-card>
    </div>
    <div class="filter-container" style="margin-bottom: 10px">
      <el-input class="filter-item" placeholder="测试商户" disabled />
      <el-input
        v-model="Out.amount"
        placeholder="金额"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="Out.pay_type"
        placeholder="支付方式"
        class="filter-item"
      >
        <el-option
          v-for="item in payTypeOption"
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
        @click="testOutOrder"
      >
        测试代付下单
      </el-button>
      <el-card v-if="out.order_no" class="link-wrap">
        <div>订单ID: {{ out.order_no }}</div>
        <div>链接： {{ out.show_page || "-" }}</div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { MessageBox } from "element-ui";
import { testCollectOrder, testOutOrder } from "@/api/collect";
import { payTypeOption } from "@/utils/const";

export default {
  name: "Customer",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      originalType: [],
      Collect: {
        amount: "",
        pay_type: "",
        platform_id: "GP12339876fo",
        sign: "2",
        callback_url: "7912",
        number: "79122387643388213131",
        name: "xaxx",
        organ: "xaxx",
        currency_code: "CNY",
      },
      Out: {
        amount: "",
        sign: "2",
        pay_type: "",
        platform_id: "GP12339876fo",
        sign: "2",
        callback_url: "7912",
        number: "79122387643388213131",
        name: "xaxx",
        organ: "xaxx",
        currency_code: "CNY",
        address: "7912",
      },
      payTypeOption,
      collect: {},
      out: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {},
    testCollect() {
      if (this.Collect.amount === "" || this.Collect.pay_type === "") {
        this.$message.error("金额与支付方式不能为空！");
        return;
      }
      this.listLoading = true;
      testCollectOrder(this.Collect).then((response) => {
        this.listLoading = false;
        this.collect = response;
        console.log(response);
      });
    },
    testOutOrder() {
      if (this.Out.amount === "" || this.Out.pay_type === "") {
        this.$message.error("金额与支付方式不能为空！");
        return;
      }
      this.listLoading = true;
      testOutOrder(this.Out).then((response) => {
        this.listLoading = false;
        this.out = response;
        console.log(response);
      });
    },
    handleFilter() {
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-item {
  width: 200px;
  margin-left: 10px;
}
.filter-item-btn {
  margin-left: 10px;
}
.link-wrap {
  width: 750px;
  margin: 20px;
  div {
    padding-top: 10px;
  }
}
</style>