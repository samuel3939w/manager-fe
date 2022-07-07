<template>
  <div class="login-wrapper">
    <div class="modal">
      <div class="title">葡眾後台系統</div>
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <el-form-item prop="userName">
          <el-input type="text" v-model="user.userName">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="user.password">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginClick"
            >登入</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { login } from "../api/index";

const user = ref({
  userName: "",
  password: "",
});
const rules = ref({
  userName: [
    {
      required: true,
      message: "請輸入用戶名",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "請輸入密碼",
      trigger: "blur",
    },
  ],
});

const userForm = ref(null);
const router = useRouter();
const store = useStore();
const loginClick = () => {
  userForm.value.validate(async (valid) => {
    if (valid) {
      const res = await login(user.value);
      store.commit("saveUserInfo", res);
      router.push("/welcome");
    } else {
      return false;
    }
  });
};
</script>
<style scoped lang='scss'>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 30px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
