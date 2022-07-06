<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from "vue-demi";
import storage from "./utils/storage";

onMounted(() => {
  storage.setItem("userInfo", { name: "tom", age: 16 });
  console.log(storage.getItem("userInfo"));
  storage.clearItem("userInfo");
});
</script>

<style>
</style>
