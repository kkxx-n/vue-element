<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="_getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="_getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialgVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="userList"
        border
        stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column label="姓名" prop="username">
        </el-table-column>
        <el-table-column label="邮箱" prop="email">
        </el-table-column>
        <el-table-column label="电话" prop="mobile">
        </el-table-column>
        <el-table-column label="角色" prop="role_name">
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditVisible(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="Top Center 分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"  size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <add-form
      :addDialgVisible="addDialgVisible"
      @changeVisible="_changeVisible"
      @addUser="_refreshList"></add-form>
    <!-- 修改用户 -->

    <edit-form
      :editVisible="editVisible"
      @changeEditVisible="_changeEditVisible"
      :editForm="editForm"
      @changeEdit="_refreshList"></edit-form>

    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed">
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsersList, changeUserState, queryUser, removeUser, getRoleList, changeRoleId } from '../../api/users.js'
import AddForm from './addForm/AddForm'
import EditForm from './addForm/EditDialog'

export default {
  name: 'Users',
  components: {
    AddForm,
    EditForm
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialgVisible: false,
      editVisible: false,
      userId: '',
      editForm: {},
      setRoleDialogVisible: false,
      // 分配角色的信息
      userInfo: {},
      roleList: [],
      selectRoleId: ''
    }
  },
  created () {
    this._getUsersList()
  },
  methods: {
    // 监听pagesize改变
    handleSizeChange (message) {
      this.queryInfo.pagesize = message
      this._getUsersList()
    },
    // 监听页码值的改变
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this._getUsersList()
    },
    // 修改用户状态
    userStateChange (userInfo) {
      const mgState = userInfo.mg_state
      const { id } = userInfo
      this._changeUserState({ mg_state: mgState, id })
        .then(null, () => {
          userInfo.mg_state = !userInfo.mg_state
        })
    },
    showEditVisible (id) {
      this.editVisible = !this.editVisible
      this.userId = id
      this._queryUser()
    },
    // 展示分配角色对话框
    setRole (userInfo) {
      this.userInfo = userInfo

      this._getRoleList()
      // 获取所有角色列表
      this.setRoleDialogVisible = true
    },
    // 确认角色
    saveRoleInfo () {
      if (!this.selectRoleId) return this.$message.error('请选择用户角色')

      this._changeRoleId()
    },
    // 分配角色对话款关闭
    setRoleDialogClosed () {
      this.selectRoleId = ''
      this.userInfo = {}
    },
    async _getUsersList () {
      const { data, meta } = await getUsersList(this.queryInfo)
      if (meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userList = data.users
      this.total = data.total
    },
    async _changeUserState (data) {
      const { meta } = await changeUserState(data)
      if (meta.status !== 200) {
        this.$message.error('更新用户状态失败')
        return Promise.reject(meta.msg)
      }
      this.$message.success(meta.msg)
      return Promise.resolve()
    },
    // 根据用户id删除用户信息
    async removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') this.$message.info('取消了删除')
      const { meta } = await removeUser(id)

      if (meta.status !== 200) return this.$message.error('获取用户信息失败')

      this.$message.success('获取用户信息失败')
      this._getUsersList()
    },
    async _queryUser () {
      const { data, meta } = await queryUser(this.userId)
      if (meta.status !== 200) return this.$message.error('获取用户信息失败')

      this.editForm = data
    },
    // 获取角色列表
    async _getRoleList () {
      const { data, meta } = await getRoleList()

      if (meta.status !== 200) return this.$message.error(meta.msg)
      console.log(data)

      this.roleList = data
    },
    async _changeRoleId () {
      const { meta } = await changeRoleId(this.userInfo.id, this.selectRoleId)

      if (meta.status !== 200) return this.$message.error(meta.msg)

      this.$message.success(meta.msg)
      this.getUsersList()
      this.setRoleDialogVisible = false
    },
    _changeVisible () {
      this.addDialgVisible = !this.addDialgVisible
    },
    _changeEditVisible () {
      this.editVisible = !this.editVisible
    },
    _refreshList () {
      this.addDialgVisible = !this.addDialgVisible
      this._getUsersList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, .15);

  .el-table {
    margin-top: 15px;
    font-size: 12px;
  }

  .el-pagination {
    margin-top: 15px;
  }
}

</style>
