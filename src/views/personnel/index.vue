<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-input
        v-model="listQuery.name"
        placeholder="名称/账号"
        style="width: 200px; margin-left: 5px"
        class="filter-item"
        clearable
        size="small"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.group_id"
        placeholder="团队"
        style="width: 140px; margin-left: 5px"
        class="filter-item"
        clearable
        size="small"
      >
        <el-option
          v-for="item in userGroup"
          :key="item.user_name"
          :label="item.user_name"
          :value="item.id"
        />
      </el-select>

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="small"
        icon="el-icon-edit"
        @click="dialogCreateVisible = true"
      >
        添加团队
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="small"
        icon="el-icon-circle-plus-outline"
        @click="dialogMemberCreateVisible = true"
      >
        添加会员
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
        label="姓名"
        prop="user_name"
        min-width="100px"
        align="center"
      />
      <el-table-column
        label="账号"
        prop="account"
        min-width="150px"
        align="center"
      />
      <el-table-column label="所属" prop="group_name" width="100px" />
      <el-table-column
        label="用户状态"
        prop="status"
        min-width="80px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="余额" prop="account_amount" min-width="100px" />
      <el-table-column
        label="银行卡收款费率"
        prop="bank_collect_val"
        min-width="100px"
      />
      <el-table-column
        label="银行卡出款费率"
        prop="bank_out_val"
        min-width="100px"
      />
      <el-table-column
        label="支付宝收款费率"
        prop="ali_collect_val"
        min-width="100px"
      />
      <el-table-column
        label="支付宝出款费率"
        prop="ali_out_val"
        min-width="100px"
      />
      <el-table-column
        label="微信收款费率"
        prop="wx_collect_val"
        min-width="100px"
      />
      <el-table-column
        label="微信出款费率"
        prop="wx_out_val"
        min-width="100px"
      />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        min-width="140px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-radio-group
            v-model="row.status"
            @change="
              (label) => {
                selectUserStatus(label, row.id);
              }
            "
          >
            <el-radio :label="1"> 启用 </el-radio>
            <el-radio :label="0"> 禁用 </el-radio>
          </el-radio-group>
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

    <el-dialog :title="'创建团队'" :visible.sync="dialogCreateVisible">
      <el-form
        ref="rulesGroup"
        :model="createTemp"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left: 50px"
        :rules="rulesGroup"
      >
        <el-form-item label="名字" prop="user_name">
          <el-input v-model="createTemp.user_name" />
        </el-form-item>
        <el-form-item label="账号" prop="user_account">
          <el-input v-model="createTemp.user_account" />
        </el-form-item>
        <el-form-item label="银行卡收款/10000" prop="bank_collect_val">
          <el-input v-model="createTemp.bank_collect_val" />
        </el-form-item>
        <el-form-item label="银行卡出款/10000" prop="bank_out_val">
          <el-input v-model="createTemp.bank_out_val" />
        </el-form-item>
        <el-form-item label="支付宝收款/10000" prop="ali_collect_val">
          <el-input v-model="createTemp.ali_collect_val" />
        </el-form-item>
        <el-form-item label="支付宝出款/10000" prop="ali_out_val">
          <el-input v-model="createTemp.ali_out_val" />
        </el-form-item>
        <el-form-item label="微信收款/10000" prop="wx_collect_val">
          <el-input v-model="createTemp.wx_collect_val" />
        </el-form-item>
        <el-form-item label="微信出款/10000" prop="wx_out_val">
          <el-input v-model="createTemp.wx_out_val" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCreateData()"> 取消 </el-button>
        <el-button type="primary" @click="createData()"> 确认 </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'创建会员'" :visible.sync="dialogMemberCreateVisible">
      <el-form
        ref="form"
        :model="createMember"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left: 50px"
        :rules="rules"
      >
        <el-form-item label="团队名称" prop="group_id">
          <el-select v-model="createMember.group_id" placeholder="请选择团队">
            <el-option
              v-for="item in list"
              :key="item.user_account"
              :label="item.user_name"
              :value="item.group_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="昵称" prop="user_name">
          <el-input v-model="createMember.user_name" />
        </el-form-item>
        <el-form-item label="账号" prop="user_account">
          <el-input v-model="createMember.user_account" />
        </el-form-item>
        <el-form-item label="银行卡收款/10000" prop="bank_collect_val">
          <el-input v-model="createMember.bank_collect_val" />
        </el-form-item>
        <el-form-item label="银行卡出款/10000" prop="bank_out_val">
          <el-input v-model="createMember.bank_out_val" />
        </el-form-item>
        <el-form-item label="支付宝收款/10000" prop="ali_collect_val">
          <el-input v-model="createMember.ali_collect_val" />
        </el-form-item>
        <el-form-item label="支付宝出款/10000" prop="ali_out_val">
          <el-input v-model="createMember.ali_out_val" />
        </el-form-item>
        <el-form-item label="微信收款/10000" prop="wx_collect_val">
          <el-input v-model="createMember.wx_collect_val" />
        </el-form-item>
        <el-form-item label="微信出款/10000" prop="wx_out_val">
          <el-input v-model="createMember.wx_out_val" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCreateMember()"> 取消 </el-button>
        <el-button type="primary" @click="createMemberData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  addUser,
  addTopUser,
  modUserStatus,
  getsUserGroup
} from '@/api/user'
import Pagination from '@/components/Pagination'

const originalStatus = [
  { key: '', display_name: '全部' },
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '正常' },
  { key: '2', display_name: '限制' }
]

const statusFilterKeyValue = originalStatus.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Personnel',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      return statusFilterKeyValue[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      userGroup: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        status: undefined
      },
      createTemp: {
        user_name: '',
        user_account: '',
        bank_collect_val: '',
        bank_out_val: '',
        ali_collect_val: '',
        ali_out_val: '',
        wx_collect_val: '',
        wx_out_val: ''
      },
      createMember: {
        group_id: undefined,
        user_name: '',
        user_account: '',
        bank_collect_val: '',
        bank_out_val: '',
        ali_collect_val: '',
        ali_out_val: '',
        wx_collect_val: '',
        wx_out_val: ''
      },
      dialogCreateVisible: false,
      dialogMemberCreateVisible: false,
      rules: {
        group_id: [
          { required: true, message: '请选择团队', trigger: 'change' }
        ],
        user_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        user_account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        bank_collect_val: [
          {
            required: true,
            message: '请输入银行卡收款/10000',
            trigger: 'blur'
          }
        ],
        bank_out_val: [
          {
            required: true,
            message: '请输入银行卡出款/10000',
            trigger: 'blur'
          }
        ],
        ali_collect_val: [
          {
            required: true,
            message: '请输入支付宝收款/10000',
            trigger: 'blur'
          }
        ],
        ali_out_val: [
          {
            required: true,
            message: '请输入支付宝出款/10000',
            trigger: 'blur'
          }
        ],
        wx_collect_val: [
          { required: true, message: '请输入微信收款/10000', trigger: 'blur' }
        ],
        wx_out_val: [
          { required: true, message: '请输入微信出款/10000', trigger: 'blur' }
        ]
      },
      rulesGroup: {
        user_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        user_account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        bank_collect_val: [
          {
            required: true,
            message: '请输入银行卡收款/10000',
            trigger: 'blur'
          }
        ],
        bank_out_val: [
          {
            required: true,
            message: '请输入银行卡出款/10000',
            trigger: 'blur'
          }
        ],
        ali_collect_val: [
          {
            required: true,
            message: '请输入支付宝收款/10000',
            trigger: 'blur'
          }
        ],
        ali_out_val: [
          {
            required: true,
            message: '请输入支付宝出款/10000',
            trigger: 'blur'
          }
        ],
        wx_collect_val: [
          { required: true, message: '请输入微信收款/10000', trigger: 'blur' }
        ],
        wx_out_val: [
          { required: true, message: '请输入微信出款/10000', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
      getsUserGroup().then((response) => {
        this.userGroup = response
      })
    },
    // 筛选
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 修改状态
    selectUserStatus(label, id) {
      this.listLoading = true
      modUserStatus({
        id: id,
        status: label
      })
        .then(() => {
          this.listLoading = false
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
        .catch((error) => {
          this.listLoading = false
          console.log(error)
        })
    },
    // 添加团队
    createData() {
      this.listLoading = true
      this.$refs['rulesGroup'].validate((valid) => {
        if (valid) {
          addTopUser(this.createTemp)
            .then(() => {
              this.dialogCreateVisible = false
              this.listLoading = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.cancelCreateData()
            })
            .catch((error) => {
              this.dialogCreateVisible = false
              console.log(error)
            })
        }
      })
    },
    // 关闭团队弹窗
    cancelCreateData() {
      this.dialogCreateVisible = false
      this.createTemp = {}
    },
    // 添加会员
    createMemberData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.listLoading = true
          addUser(this.createMember)
            .then(() => {
              this.dialogCreateVisible = false
              this.listLoading = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.cancelCreateMember()
            })
            .catch((error) => {
              this.dialogMemberCreateVisible = false
              console.log(error)
            })
        }
      })
    },
    // 关闭添加会员弹窗
    cancelCreateMember() {
      this.dialogMemberCreateVisible = false
      this.createMember = {}
    }
  }
}
</script>
<style lang="scss">
.input-flex {
  display: flex;
  flex-direction: row;
}
</style>
