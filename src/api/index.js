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
    data: params,
    mock: false,
  });
};

export const permissionListApi = () => {
  return request({
    url: "/users/getPermissionList",
    method: "get",
    data: {},
    mock: false,
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

export const allUserListApi = () => {
  return request({
    url: "/users/all/list",
    method: "get",
    data: {},
    mock: false,
  });
};

export const allUserListByDeptApi = (params) => {
  return request({
    url: "/users/bydept/list",
    method: "get",
    data: params,
    mock: false,
  });
};

// 上禮拜做到獲取資訊人員列表
export const ItUserListApi = () => {
  return request({
    url: "/users/itall/list",
    method: "get",
    data: {},
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

export const roleAllListApi = () => {
  return request({
    url: "/roles/allList",
    method: "get",
    mock: false,
  });
};

export const roleListApi = (params) => {
  return request({
    url: "/roles/List",
    method: "get",
    data: params,
    mock: false,
  });
};

export const deptListApi = (params) => {
  return request({
    url: "/dept/list",
    method: "get",
    data: params,
    mock: false,
  });
};

export const allDeptListApi = () => {
  return request({
    url: "/dept/all/list",
    method: "get",
    data: {},
    mock: false,
  });
};

export const deptOperateApi = (params) => {
  return request({
    url: "/dept/operate",
    method: "post",
    data: params,
    mock: false,
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

export const menuSubmitApi = (params) => {
  return request({
    url: "/menu/operate",
    method: "post",
    data: params,
    mock: false,
  });
};

export const roleOperateApi = (params) => {
  return request({
    url: "/roles/operate",
    method: "post",
    data: params,
    mock: false,
  });
};

export const updatePermissionApi = (params) => {
  return request({
    url: "/roles/update/permission",
    method: "post",
    data: params,
    mock: false,
  });
};

export const applyListApi = (params) => {
  return request({
    url: "/leave/list",
    method: "get",
    data: params,
    mock: false,
  });
};

export const leaveOperateApi = (params) => {
  return request({
    url: "/leave/operate",
    method: "post",
    data: params,
    mock: false,
  });
};

export const leaveApproveApi = (params) => {
  return request({
    url: "/leave/approve",
    method: "post",
    data: params,
    mock: false,
  });
};

export const systemListApi = (params) => {
  return request({
    url: "/system/list",
    method: "get",
    data: params,
    mock: false,
  });
};

export const systemOperateApi = (params) => {
  return request({
    url: "/system/operate",
    method: "post",
    data: params,
    mock: false,
  });
};

export const systemApproveApi = (params) => {
  return request({
    url: "/system/approve",
    method: "post",
    data: params,
    mock: false,
  });
};

export const systemAddSignatureApi = (params) => {
  return request({
    url: "/system/addSignature",
    method: "post",
    data: params,
    mock: false,
  });
};