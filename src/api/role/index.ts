import http from "../index";
import { ResponseData } from "../type";
import { Role } from "./types";

enum API {
  ROLE = "/admin/roles",
}

// 获取角色列表
export const getRoleList = () => {
  return http.get<any, ResponseData<Role[]>>(API.ROLE);
};

// 创建角色
export const createRole = (data: Role) => {
  return http.post<any, ResponseData<Role>>(API.ROLE, data);
};

// 更新角色
export const updateRole = (id: string, data: Role) => {
  return http.patch<any, ResponseData<Role>>(API.ROLE, data, {
    params: { id },
  });
};

// 删除角色
export const deleteRole = (id: string) => {
  console.log('发送删除请求:', id);  // 添加日志
  return http.delete<any, ResponseData<null>>(API.ROLE, {
    params: { id },
  });
}; 