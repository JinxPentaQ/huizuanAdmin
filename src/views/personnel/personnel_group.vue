<template>
  <div class="app-container">
    <el-tree :data="list" :props="defaultProps" @node-click="handleNodeClick" ></el-tree>
  </div>
</template>

<script>
import { getUserGroup } from '@/api/user'
import { MessageBox } from 'element-ui'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      temp: {
        remark: '',
        name: ''
      },
      defaultProps: {
        label: (data,node)=>{
          return `${data.user_name} ${data.account}`
        },
        children: 'child',
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getUserGroup().then(response => {
        this.list = response;
        this.listLoading = false;
      })
    },
    handleNodeClick() {

    },
  }
}
</script>
