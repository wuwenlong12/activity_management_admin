import http from "../index";
import { ResponseData } from "../type";
import { User, UpdateUserParams, UserListResponse } from "./types";

enum API {
  USER = "/admin/users",
}

//删除user
export const deleteUser = (id: string) =>
  http.delete<any,ResponseData<null>>(API.USER, { params: { id } })

//查找user
export const getUser = (id: string) =>
  http.get<any,User>(API.USER, { params: { id } });

//修改user
export const updateUser = (id: string, data: UpdateUserParams) =>
  http.patch<any, ResponseData<User>>(API.USER, data, {
    params: { id }, // 会自动拼接为 ?id=value
  });

// 获取用户列表
export const getUserList = (params: { page: number; limit: number }) => {
  return http.get<any,ResponseData<UserListResponse>>(API.USER, { params })
};

export const createUser = (params: User) => {
  return http.post<any, ResponseData<null>>(API.USER, params)
}


