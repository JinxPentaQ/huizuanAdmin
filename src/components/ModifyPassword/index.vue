<template>
  <div>
    <el-dialog
      title="修改密码"
      :visible.sync="modifyVisible"
      width="400px"
      :before-close="close"
    >
      <el-form
        ref="modifyForm"
        :model="modifyForm"
        :rules="modifyRules"
        auto-complete="on"
        label-position="left"
        label-width="90px"
      >
        <el-form-item prop="newPassword" label="新密码">
          <el-input
            v-model="modifyForm.newPassword"
            placeholder="新密码"
            type="password"
            tabindex="1"
            auto-complete="on"
            style="width: 270px;"
          />
        </el-form-item>
        <el-form-item prop="confirmNewPassword" label="确认密码">
          <el-input
            v-model="modifyForm.confirmNewPassword"
            placeholder="新密码"
            type="password"
            tabindex="1"
            auto-complete="on"
            style="width: 270px;"
          />
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-top: 20px;"
          @click.native.prevent="handleModify"
        >确认修改</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ModPwd } from '@/api/admin'
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatePassword = (rules, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于六位'))
      } else {
        callback()
      }
    }
    return {
      modifyVisible: false,
      loading: false,
      modifyForm: {
        newPassword: '',
        confirmNewPassword: ''
      },
      modifyRules: {
        newPassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        confirmNewPassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  watch: {
    visible(val) {
      this.modifyVisible = val
    }
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.modifyForm = {}
    },
    handleModify() {
      this.$refs.modifyForm.validate(valid => {
        if (valid) {
          if (this.modifyForm.newPassword === this.modifyForm.confirmNewPassword) {
            this.loading = true
            ModPwd({ pwd: this.modifyForm.newPassword }).then((res) => {
              this.close()
              this.loading = false
              this.$message.success('修改成功!')
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message.error('新密码两次输入不一致，请重新输入!')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang='scss' src="./index.scss" />
