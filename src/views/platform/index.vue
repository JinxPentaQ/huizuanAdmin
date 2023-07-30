<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <!-- <el-input
        v-model="listQuery.name"
        placeholder="关键字"
        style="width: 200px;margin-left: 5px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button> -->
      <el-button type="primary" @click="addPlatformDialog()" size="small"
        >添加商户</el-button
      >
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
      <el-table-column label="ID" prop="id" minWidth="50px" align="center" />
      <el-table-column
        label="编号"
        prop="platform_sn"
        minWidth="150px"
        align="center"
      />
      <el-table-column
        label="名称"
        prop="name"
        minWidth="100px"
        align="center"
      />
      <el-table-column
        label="余额"
        prop="business_amount"
        minWidth="100px"
        align="center"
      />
      <el-table-column
        label="银行卡费率"
        prop="collect_bank_free"
        minWidth="100px"
        align="center"
      />
      <el-table-column
        label="微信费率"
        prop="collect_wx_free"
        minWidth="100px"
        align="center"
      />
      <el-table-column
        label="支付宝费率"
        prop="collect_ali_free"
        minWidth="100px"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="desire"
        align="center"
        minWidth="100px"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="密钥"
        prop="private_key"
        align="center"
        minWidth="300px"
      />
      <el-table-column
        label="白名单"
        prop="whitelist"
        align="center"
        minWidth="250px"
      />

      <!-- <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog :title="'添加商户'" :visible.sync="dialogAddPlatformVisible">
      <el-form
        ref="dataForm"
        :model="platformAdd"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="商户名称:">
          <el-input
            v-model="platformAdd.name"
            placeholder="商户名称"
            style="width: 200px; margin-left: 5px"
          />
        </el-form-item>
        <el-form-item label="商户后台账号:">
          <el-input
            v-model="platformAdd.account"
            placeholder="商户后台账号"
            style="width: 200px; margin-left: 5px"
          />
        </el-form-item>
        <el-form-item label=" 银行卡费率/万:">
          <el-input
            v-model="platformAdd.collect_bank_free"
            placeholder="银行卡费率"
            style="width: 200px; margin-left: 5px"
          />
        </el-form-item>
        <el-form-item label=" 微信费率/万:">
          <el-input
            v-model="platformAdd.collect_wx_free"
            placeholder="微信费率"
            style="width: 200px; margin-left: 5px"
          />
        </el-form-item>
        <el-form-item label=" 支付宝费率/万:">
          <el-input
            v-model="platformAdd.collect_ali_free"
            placeholder="支付宝费率"
            style="width: 200px; margin-left: 5px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddPlatformVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="AddPlatform()"> 确认 </el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getsPlatform, addPlatform } from "@/api/platform";
import { MessageBox } from "element-ui";
import { confirmOutOrder } from "@/api/out-order";

const status = [
  { id: "0", name: "禁用" },
  { id: "1", name: "正常" },
];

const statusFilterKeyValue = status.reduce((acc, cur) => {
  acc[cur.id] = cur.name;
  return acc;
}, {});

export default {
  name: "Platform",
  components: { Pagination },
  filters: {
    statusFilter(key) {
      return statusFilterKeyValue[key];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        type: undefined,
        status: undefined,
      },
      dialogAddPlatformVisible: false,
      platformAdd: {
        name: "",
        account: "",
        collect_bank_free: "",
        collect_wx_free: "",
        collect_ali_free: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.pClear();
      getsPlatform(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    addPlatformDialog() {
      this.dialogAddPlatformVisible = true;
    },
    AddPlatform() {
      if (this.platformAdd.name === "") {
        this.$message.error("请输入商户名称");
        return;
      }
      if (this.platformAdd.account === "") {
        this.$message.error("请输入商户后台账号");
        return;
      }
      if (this.platformAdd.collect_bank_free === "") {
        this.$message.error("请输入银行卡费率");
        return;
      }
      if (this.platformAdd.collect_wx_free === "") {
        this.$message.error("请输入微信费率");
        return;
      }
      if (this.platformAdd.collect_ali_free === "") {
        this.$message.error("请输入支付宝费率");
        return;
      }
      this.dialogAddPlatformVisible = false;
      this.listLoading = true;
      addPlatform(this.platformAdd)
      .then((response) => {
        this.listLoading = false;
        this.getList();
      })
      .catch((error) => {
        this.listLoading = false;
        console.log(error);
      });
    },
    handleUpdate(row) {
      console.log(row);
    },
    handleDelete(row) {
      console.log(row);
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    pClear() {
      this.platformAdd.name = "";
      this.platformAdd.account = "";
      this.platformAdd.collect_wx_free = "";
      this.platformAdd.collect_bank_free = "";
      this.platformAdd.collect_ali_free = "";
    },
  },
};
</script>
