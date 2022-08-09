<template>
  <template v-for="menu in userMenu" :key="menu._id">
    <el-sub-menu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :index="menu.path"
    >
      <template #title>
        <el-icon>
          <component v-bind:is="vue3Icon(menu.icon)"></component>
        </el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <tree-menu :userMenu="menu.children" />
    </el-sub-menu>
    <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path">
      {{ menu.menuName }}
    </el-menu-item>
  </template>
</template>

<script setup>
import { onMounted } from "vue";

const vue3Icon = (icon) => {
  if (typeof icon === "string") {
    const tempArr = icon.split("-");
    return tempArr[tempArr.length - 1];
  }
  return;
};

defineProps({
  userMenu: { type: Array, default: [] },
});
</script>
<style scoped lang='scss'>
</style>
