<template>
  <div>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
        <router-link to="/welcome" v-if="index == 0">
          {{ item.meta.title }}
        </router-link>
        <span v-else>{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute();
const breadList = computed(() => {
  return route.matched;
});
</script>
<style scoped lang='scss'>
</style>
