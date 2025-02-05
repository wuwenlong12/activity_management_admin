import http from "../index";
import { ResponseData } from "../type";
import {  School } from "./types";

enum API {
  SCHOOL = "/school",
}


// 获取学校列表
export const getSchoolList = () => {
  return http.get<any, ResponseData<School[]>>(API.SCHOOL);
};


// 创建学校
export const createSchool = (data: School) => {
  return http.post<any, ResponseData<School>>(API.SCHOOL, data);
};



// 更新学校
export const updateSchool = (id: string, data: School) => {
  return http.patch<any, ResponseData<null>>(API.SCHOOL, data, {
    params: { id },
  });
};



// 删除学校
export const deleteSchool = (id: string) => {
  console.log('发送删除请求:', id);  // 添加日志

  return http.delete<any, ResponseData<null>>(API.SCHOOL, {
    params: { id },
  });
}; 