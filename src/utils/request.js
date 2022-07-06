/**
 * axios二次封裝
 */
import axios from "axios";
import { ElMessage } from "element-plus";
import config from "./../config";
import router from "./../router";
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
  if (!headers.Authorization) headers.Authorization = "Bear Sam";
  return req;
});

//響應攔截
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  if (code === 200) {
    return data;
  } else if (code === 40001) {
    ElMessage.error(TOKEN_INVALID);
    setTimeout(() => {
      router.push("/login");
    }, 15000);
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

  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
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