import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 指令
import installDirective from '@/directives'

const app = createApp(App);

app.directive("has", {
  beforeMount: (el, binding) => {
    // 獲取按鈕權限
    const actionList = store.state.actionList;
    const value = binding.value;
    // 判斷列表中是否有對應的按鈕權限標示
    const hasPermission = actionList.includes(value);
    if (!hasPermission) {
      el.style = "display:none";
      setTimeout(() => {
        el.parentNode.removeChild(el);
      });
    }
  },
});

installDirective(app)

// 註冊全局圖示
for (let [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router).use(store).use(ElementPlus).mount("#app");
