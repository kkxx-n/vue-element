<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>

        <!-- 角色列表 -->
        <el-table :data="roleList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children"
                :key="item1.id">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag
                    closable
                    @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag
                        closable
                        type="success"
                        @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag closable type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="removeRightById(scope.row, item3.id)">
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="rolename">
          </el-table-column>
          <el-table-column label="角色描述" prop="roleDesc">
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" class="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" class="el-icon-delete" size="mini">删除</el-button>
              <el-button type="warning" class="el-icon-setting" size="mini"
                @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>

  <!-- 分配权限 -->
  <el-dialog
    title="分配权限"
    :visible.sync="setRightDialogVisible"
    width="50%"
    @close="handleRightsClose">
    <el-tree
      :data="rightsList"
      :props="treeProp"
      show-checkbox
      node-key="id"
      default-expand-all
      ref="treeRef"
      :default-checked-keys="defaultKeys"></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setRightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
import { getRolesList, deleteRolePurview, getAllRightList, setAllRightList } from '../../api/roles.js'

const RESPONSETYPE = 'tree'

export default {
  name: 'Roles',
  data () {
    return {
      roleList: [],
      roleData: {},
      // 当前用户ID
      roleId: '',
      // 分配权限控制的对话款
      setRightDialogVisible: false,
      rightsList: [],
      // 树形控件属性绑定对象
      treeProp: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点ID值
      defaultKeys: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data, meta } = await getRolesList()
      if (meta.status !== 200) return this.$message.error(meta.msg)
      console.log(data)

      this.roleList = data
    },
    async removeRightById (role, rightId) {
      console.log(role)
      this.roleData = {
        roleId: role.id,
        rightId: rightId
      }

      const confirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirm !== 'confirm') {
        return this.$message.info('取消删除权限')
      }

      this._deleteRolePurview(role)
    },
    // 展示分配权限的对话框
    showSetRightDialog (role) {
      this.roleId = role.id
      this._getAllRightList()
      this._getLeafKeys(role, this.defaultKeys)
      this.setRightDialogVisible = true
    },
    handleRightsClose () {
      // 重置tree组件的选中数组defaultKeys
      this.defaultKeys = []
    },
    // 点击为角色分配全新
    allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(idStr)
      this._setAllRightList(idStr)
    },
    async _deleteRolePurview (role) {
      const { data, meta } = await deleteRolePurview(this.roleData)
      if (meta !== 200) {
        return this.$message.error(meta.msg)
      }
      this.$message.success(meta.msg)
      role.children = data
    },
    // 获取权限列表
    async _getAllRightList () {
      const { data, meta } = await getAllRightList(RESPONSETYPE)
      if (meta.status !== 200) return this.$message.error(meta.msg)

      this.rightsList = data
    },
    // 设置用户权限列表
    async _setAllRightList (idStr) {
      const { meta } = await setAllRightList(this.roleId, idStr)
      if (meta.status !== 200) return this.$message.error(meta.msg)

      this.$message.success(meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 通过递归获得角色项所有三级权限的ID保存到defaultKeys中
    _getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this._getLeafKeys(item, arr)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 15px;

  .el-button {
    float: left;
  }
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.el-tag {
  margin: 7px;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
