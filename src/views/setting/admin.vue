<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <!-- <el-input
        v-model="listQuery.name"
        placeholder="名称/账号"
        style="width: 200px; margin-left: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button> -->
      <el-button
        class="filter-item-btn"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="dialogCreateVisible = true"
        size="small"
      >
        添加管理员
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
      <el-table-column label="id" prop="id" minWidth="100px" align="center" />
      <el-table-column
        label="昵称"
        prop="name"
        minWidth="100px"
        align="center"
      />
      <el-table-column
        label="账号"
        prop="account"
        minWidth="150px"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="status"
        minWidth="80px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        minWidth="140px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="danger" size="mini" @click="handleDelete(row)"
            >删除</el-button
          >
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
    <el-dialog :title="'添加管理员'" :visible.sync="dialogCreateVisible">
      <el-form
        ref="createForm"
        :model="create"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left: 50px"
        :rules="rules"
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="create.name" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="create.account" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="create.pwd" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCreateData()"> 取消 </el-button>
        <el-button type="primary" @click="createData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delAdmin, addAdmin, getAdmin } from "@/api/admin";
import Pagination from "@/components/Pagination";
import { MessageBox } from "element-ui";

const originalStatus = [
  { key: "", display_name: "全部" },
  { key: "0", display_name: "禁用" },
  { key: "1", display_name: "正常" },
  { key: "2", display_name: "限制" },
];

const statusFilterKeyValue = originalStatus.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "Personnel",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      return statusFilterKeyValue[status];
    },
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于六位!'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      create: {
        name: "",
        account: "",
        pwd: "",
      },
      dialogCreateVisible: false,
      rules: {
        name: [{ required: true, trigger: 'blur', message: "昵称不能为空!"}],
        account: [{ required: true, trigger: 'blur', message: '账号不能为空!'}],
        pwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      getAdmin(this.listQuery).then((response) => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    // 筛选
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 删除
    handleDelete(row) {
      this.listLoading = true;
      MessageBox.confirm("确认删除管理员？", "确认删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.listLoading = true;
        return new Promise((resolve, reject) => {
          delAdmin({ id: `${row.id}` })
            .then((response) => {
              this.listLoading = false;
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000,
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
    // 添加管理员
    createData() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.listLoading = true;
          addAdmin(this.create)
            .then(() => {
              this.dialogCreateVisible = false;
              this.listLoading = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000,
              });
              this.getList();
              this.cancelCreateData();
            })
            .catch((error) => {
              this.dialogCreateVisible = false;
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 关闭添加弹窗
    cancelCreateData() {
      this.dialogCreateVisible = false;
      this.create = {};
    },
  },
};
</script>
<style lang="scss">
.input-flex {
  display: flex;
  flex-direction: row;
}
</style>