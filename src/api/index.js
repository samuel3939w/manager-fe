/**
 * api管理
 */
import request from "./../utils/request";
export const loginApi = (params) => {
  return request({
    url: "/users/login",
    method: "post",
    data: params,
    mock: false,
  });
};

export const noticeCountApi = (params) => {
  return request({
    url: "/leave/count",
    method: "get",
    data: {},
    mock: true,
  });
};

export const menuListApi = (params) => {
  return request({
    url: "/menu/list",
    method: "get",
    data: {},
    mock: true,
  });
};

export const userListApi = (params) => {
  return request({
    url: "/users/list",
    method: "get",
    data: params,
    mock: false,
  });
};

export const userDelApi = (data) => {
  return request({
    url: "/users/delete",
    method: "post",
    data,
    mock: false,
  });
};

export const roleListApi = () => {
  return request({
    url: "/roles/allList",
    method: "get",
    mock: true,
  });
};

export const deptListApi = () => {
  return request({
    url: "/dept/list",
    method: "get",
    mock: true,
  });
};

export const userSubmitApi = (params) => {
  return request({
    url: "/users/operate",
    method: "post",
    data: params,
    mock: false,
  });
};
