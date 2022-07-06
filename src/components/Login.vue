<template>
  <div>
    <h1>歡迎來到登入介面</h1>
    <el-button type="primary" @click="goHome">回首頁</el-button>
  </div>
</template>

<script setup>
import {} from 'vue'
import { useRouter } from 'vue-router';

const router=useRouter()
const goHome=()=>{
  router.push('/welcome')
}
</script>
<style scoped lang='scss'>
</style>
