/**
 * Vuex狀態管理
 */
import { createStore } from "vuex";
import mutations from "./mutations";
import storage from "./../utils/storage";
const state = {
  userInfo: storage.getItem("userInfo") || "", //獲取用戶信息
};
export default createStore({
  state,
  mutations,
});
