/**
 * api管理
 */
import request from "./../utils/request";
export const loginApi = (params) => {
  return request({
    url: "/users/login",
    method: "post",
    data: params,
  });
};

export const noticeCountApi = (params) => {
  return request({
    url: "/leave/count",
    method: "get",
    data: {},
  });
};

export const menuListApi = (params) => {
  return request({
    url: "/menu/list",
    method: "get",
    data: {},
  });
};
