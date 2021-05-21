<template>
  <el-dialog
    title="添加用户"
    :visible.sync="addDialgVisible"
    width="30%"
    :before-close="handleClose"
    @close="resetForm">
    <!-- 内容主题区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="modile">
        <el-input v-model="addForm.modile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="changeFormVisible">取 消</el-button>
      <el-button type="primary" @click="changeFormAddUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addUser } from '../../../api/users.js'

export default {
  name: 'AddForm',
  data () {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        return callback()
      }

      callback(new Error('请输入合法的邮箱'))
    }

    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]18[0-9]14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }

      callback(new Error('请输入合法的手机号'))
    }
    return {
      addForm: {
        username: '',
        password: '',
        email: '',
        modile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在三到十位之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入密码长度在六到十五位之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        modile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    addDialgVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    changeFormVisible () {
      this.$emit('changeVisible')
    },
    changeFormAddUser () {
      this.$emit('addUser')
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this._addUser()
      })
    },
    resetForm () {
      this.$refs.addFormRef.resetFields()
    },
    handleClose () {
      this.$emit('changeVisible')
    },
    async _addUser () {
      const { meta } = await addUser(this.addForm)
      if (meta.status !== 201) this.$message.error('添加用户失败')

      this.$message.success('添加用户成功')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
