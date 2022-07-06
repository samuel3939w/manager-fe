<template>
  <div>
    <h1>歡迎來到登入介面</h1>
    <el-button type="primary" @click="goHome">回首頁</el-button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import request from "../utils/request";

onMounted(() => {
  // request({
  //   method: "get",
  //   url: "/login",
  //   data: {
  //     name: "jack",
  //   },
  // }).then((res) => {
  //   console.log(res);
  // });

  request
    .get("login", { name: "jack" }, { mock: true, loading: true })
    .then((res) => {
      
    });
});

const router = useRouter();
const goHome = () => {
  router.push("/welcome");
};
</script>
<style scoped lang='scss'>
</style>
