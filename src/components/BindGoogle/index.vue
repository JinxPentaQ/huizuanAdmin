<template>
  <div>
    <el-dialog title="绑定谷歌验证器" :visible.sync="dialogVisible" width="40%">
      <p>1.秘钥绑定</p>
      <div style="padding: 30px; background-color: #f2f2f2">
        <p>账号：{{ account }}</p>
        <p>秘钥：{{ serect }}</p>
      </div>
      <div>
        <p>2.扫码绑定(使用Geogle身份验证器 APP 扫码)</p>
      </div>
      <div id="qrcode" />
      <p style="text-align: center">
        请使用“Google 身份验证器APP”
        绑定，各大软件商店均可下载该APP，支持安卓、IOS系统。
      </p>
      <p style="text-align: center; color: #f56c6c">
        开启服务后，请立即使用“Google 身份验证器APP”
        绑定,以免出现无法登录的情况。
      </p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang='scss' src="./index.scss" />
