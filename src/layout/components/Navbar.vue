<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item> Home </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            谷歌身份验证
            <el-switch
              v-model="auth"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="getGoogelCode"
            />
          </el-dropdown-item>
          <el-dropdown-item class="user-dropdown" @click.native="()=> modifyVisible = true">
            修改密码
          </el-dropdown-item>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 谷歌验证器 -->
    <el-dialog title="谷歌验证器" :visible.sync="dialogVisible" width="40%">
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
    <ModifyPassword :visible.sync="modifyVisible" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { createGoogleAuth } from '@/api/admin'
import QRCode from 'qrcodejs2'
import store from '@/store'
import ModifyPassword from '@/components/ModifyPassword'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ModifyPassword
  },
  data() {
    return {
      auth: '0',
      dialogVisible: false,
      account: '',
      serect: '',
      modifyVisible: false
    }
  },

  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  watch: {
    modifyVisible(val) {
      console.log(val, 'modify')
    }
  },
  created() {
    this.auth = `${store.getters.status}`
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 获取谷歌验证码
    getGoogelCode() {
      createGoogleAuth({ status: this.auth })
        .then(res => {
          if (this.auth === 0) {
            this.$message.success('操作成功')
          } else {
            this.dialogVisible = true
            this.account = res.name
            this.serect = res.code
            this.$nextTick(() => {
              new QRCode('qrcode', {
                width: 200,
                height: 200,
                text: res.qr // 二维码地址
              })
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
#qrcode {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
