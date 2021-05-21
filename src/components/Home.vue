<template>
  <div>
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/logo.png" alt="" />
          <span>电商后台管理</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EEF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
          <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i class="iconfont" :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id"  @click="saveNavState(subItem.path)">
                <template slot="title">
                  <i class="iconfont icon-modular"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenuList } from '../api/home.js'

export default {
  name: 'home',
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'icon-user-filling',
        103: 'icon-lock',
        101: 'icon-work-filling',
        102: 'icon-file',
        145: 'icon-chart-bar'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this._getMenuList()
    this.activePath = this.$route.path.substr(1)
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async _getMenuList () {
      const { data, meta } = await getMenuList()
      if (meta.status !== 200) return this.$message.error(meta.message)
      this.menuList = data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
}
.el-header {
  background-color: #0099cc;
  display: flex;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
    img {
      height: 100%;
    }
    span {
      color: #fff;
      font-size: 20px;
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #545c64;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #ededf1;
}

.el-submenu .el-menu-item {
  padding: 0 20px;
}

.iconfont {
  padding-right: 8px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
