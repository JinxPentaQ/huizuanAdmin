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
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="timestamp"
        style="margin-left: 10px;"
        placeholder="开始时间"
      />

      <el-date-picker
        v-model="listQuery.end_time"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="timestamp"
        style="margin-left: 10px;"
        placeholder="结束时间"
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

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column label="所有者" prop="user_name" width="150px" align="center" />
      <el-table-column label="所属团队" prop="group_name" align="center" width="150px" />
      <el-table-column label="账号" prop="user_account" width="150px" align="center" />
      <el-table-column label="总数" prop="all" align="center" width="150px" />
      <el-table-column label="呼出总数" prop="connect" align="center" width="150px" />
      <el-table-column label="未呼出总数" prop="wait" align="center" width="150px" />
      <el-table-column label="意向" prop="success" align="center" width="150px" />
      <el-table-column label="新曾意向A(个)" prop="A" align="center" width="120px" />
      <el-table-column label="新曾意向B(个)" prop="B" align="center" width="120px" />
      <el-table-column label="新曾意向C(个)" prop="C" align="center" width="120px" />
      <el-table-column label="添加微信(个)" prop="is_wechat" align="center" width="120px" />
      <el-table-column label="新曾签约数(个)" prop="create_time" align="center" width="120px" />
      <el-table-column label="签单金额(万元)" prop="create_time" align="center" width="120px" />
      <el-table-column label="放款金额(万元)" prop="create_time" align="center" width="120px" />
      <el-table-column label="回款金额(元)" prop="create_time" align="center" width="120px" />
      <el-table-column label="净利润(元)" prop="create_time" align="center" width="100px" />

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>

import { getsPersonalReport } from '@/api/report'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'

export default {
  name: 'Report',
  components: { Pagination },

  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        start_time: undefined, // 前台展示时间
        end_time: undefined // 前台展示时间
      }

    }
  },
  created() {
    this.getsPersonalReport()
  },
  methods: {
    getsPersonalReport() {
      this.listLoading = true

      getsPersonalReport(this.listQuery).then(response => {
        this.list = response.items
        this.total = response.total

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getsPersonalReport()
    }

  }
}
</script>
