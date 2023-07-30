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

      <el-table-column label="时间" prop="create_time" align="center" width="150px" />
      <el-table-column label="呼出总数(已接/总数)" prop="create_time" align="center" width="150px" />
      <el-table-column label="新曾意向A(个)" prop="create_time" align="center" width="120px" />
      <el-table-column label="新曾意向B(个)" prop="create_time" align="center" width="120px" />
      <el-table-column label="新曾意向C(个)" prop="create_time" align="center" width="120px" />
      <el-table-column label="添加微信(个)" prop="create_time" align="center" width="120px" />
      <el-table-column label="新曾签约数(个)" prop="create_time" align="center" width="120px" />
      <el-table-column label="签单金额(万元)" prop="create_time" align="center" width="120px" />
      <el-table-column label="放款金额(万元)" prop="create_time" align="center" width="120px" />
      <el-table-column label="回款金额(元)" prop="create_time" align="center" width="120px" />
      <el-table-column label="今日缴约(个)" prop="create_time" align="center" width="120px" />

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

import { getsReport } from '@/api/report'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui'

const search_type = [
  { key: '', display_name: '无' },
  { key: '1', display_name: '手机号' },
  { key: '2', display_name: '姓名' },
  { key: '3', display_name: '身份证' }
]

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
        name_status: undefined,
        group_id: undefined
      },
      search_type

    }
  },
  created() {
    this.getsReport()
  },
  methods: {
    getsReport() {
      this.listLoading = true

      getsReport(this.listQuery).then(response => {
        this.list = response.items
        this.total = response.total

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }

  }
}
</script>
