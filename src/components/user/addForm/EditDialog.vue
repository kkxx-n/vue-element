<template>
  <el-dialog
    title="添加用户"
    :visible.sync="editVisible"
    width="30%"
    :before-close="handleClose"
    @close="editDialogClosed">
    <!-- 内容主题区域 -->
    <el-form ref="editFormRef" label-width="70px" :model="editForm" :rules="editFormRules">
      <el-form-item label="用户名">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="changeEditFormVisible">取 消</el-button>
      <el-button type="primary" @click="changeEditForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editUser } from '../../../api/users.js'

export default {
  name: 'EditForm',
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
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    editForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('changeEditVisible')
    },
    changeEditFormVisible () {
      this.$emit('changeEditVisible')
    },
    changeEditForm () {
      this.$emit('changeEditVisible')
      this.$refs.editFormRef.validate(valid => {
        if (!valid) this.$message.error('用户信息格式错误')
        this._editUser()
      })
    },
    changeFormAddUser () {
      this.$emit('changeEditVisible')
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async _editUser () {
      const { meta } = await editUser(this.editForm)
      if (meta.status !== 200) this.$message.error('修改用户信息失败')
      this.$emit('changeEdit')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
