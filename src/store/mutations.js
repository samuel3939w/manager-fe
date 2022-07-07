/**
 * Mutations業務層數據提交
 */
import storage from "../utils/storage";

export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    storage.setItem("userInfo", userInfo);
  },
};
