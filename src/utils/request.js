/**
 * axios二次封裝
 */
import axios from "axios";
import { ElMessage } from "element-plus";
import config from "./../config";
import router from "./../router";
import storage from "./storage";
const TOKEN_INVALID = "Token認證失敗, 請重新登入";
const NETWORK_ERROR = "網路請求異常, 請稍後重試";

//創建axios實例對象, 添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
});

//請求攔截
service.interceptors.request.use((req) => {
  const headers = req.headers;
  const { token = "" } = storage.getItem("userInfo") || {};
  if (!headers.Authorization) headers.Authorization = "Bearer " + token;
  return req;
});

//響應攔截
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  if (code === 200) {
    return data;
  } else if (code === 50001) {
    ElMessage.error(TOKEN_INVALID);
    setTimeout(() => {
      router.push("/login");
    }, 1500);
    return Promise.reject(TOKEN_INVALID);
  } else {
    ElMessage.error(msg || NETWORK_ERROR);
    return Promise.reject(msg || NETWORK_ERROR);
  }
});

function request(options) {
  options.method = options.method || "get";
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }

  let isMock = config.mock;
  if (typeof options.mock != "undefined") {
    isMock = options.mock;
  }
  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }

  return service(options);
}

["get", "post", "put", "delete", "patch"].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options,
    });
  };
});

export default request;
