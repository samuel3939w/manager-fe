<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">歡迎使用</div>
      <div class="title">葡眾後台管理系統</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script setup>
import {} from "vue";
</script>
<style scoped lang='scss'>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .content {
    position: relative;
    bottom: 40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
  }
  .img {
    margin-left: 105px;
    background-image: url("./../assets/images/welcome.png");
    width: 371px;
    height: 438px;
  }
}
</style>
