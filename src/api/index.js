/**
 * api管理
 */
import request from "./../utils/request";
export const login = (params) => {
  return request({
    url: "/users/login",
    method: "post",
    data: params,
  });
};
