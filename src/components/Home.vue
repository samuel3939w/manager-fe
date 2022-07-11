<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系統LOGO -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="" />
        <span>Manager</span>
      </div>
      <!-- 導航菜單 -->
      <el-menu
        :default-active="activeMenu"
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse="isCollapse"
      >
        <TreeMenu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon><Fold /></el-icon>
          </div>
          <div class="bread">麵包屑</div>
        </div>

        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0 ? true : false" class="notice">
            <el-icon><Bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >信箱: {{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { noticeCountApi, menuListApi } from "./../api/index.js";
import TreeMenu from "./TreeMenu.vue";

const store = useStore();
const router = useRouter();

// 提示訊息數量
const noticeCount = ref(0);
// 獲取訊息數量
const getNoticeCount = async () => {
  try {
    const count = await noticeCountApi();
    noticeCount.value = count;
  } catch (error) {
    console.error(error);
  }
};

const userMenu = ref([]);
//獲取導航菜單
const getMenuList = async () => {
  try {
    const list = await menuListApi();
    userMenu.value = list;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getNoticeCount();
  getMenuList();
});

const userInfo = ref({});
userInfo.value = store.state.userInfo;
// 點擊事件
const handleLogout = (key) => {
  if (key == "email") return;
  store.commit("saveUserInfo", "");
  userInfo.value = null;
  router.push("/login");
};

//是否展開左側導航
const isCollapse = ref(false);

const toggle = () => {
  isCollapse.value = !isCollapse.value;
};

//顯示被選中導航
const activeMenu=ref('')
activeMenu.value=location.hash.slice(1)
</script>
<style scoped lang='scss'>
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.5s;
    // 合併
    &.fold {
      width: 64px;
    }
    //展開
    &.unfold {
      width: 200px;
    }
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
  }
  .content-right {
    margin-left: 200px;
    //合併
    &.fold {
      margin-left: 64px;
    }
    //展開
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          display: flex;
          cursor: pointer;
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link {
          line-height: 50px;
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
