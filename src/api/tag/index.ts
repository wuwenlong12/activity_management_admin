import http from "..";
import { ResponseGetTag, Tag } from "./type";

enum API {
  TAG = "/tag",
}

//新增tag
export const createTag = (params: Tag) =>
  http.post<any, ResponseGetTag>(API.TAG, params);

//删除tag
export const deleteTag = (id: string) =>
  http.delete<any, ResponseGetTag>(API.TAG, {
    params: {
      id,
    },
  });
//查找全部tag
export const getTagList = () => http.get<any, ResponseGetTag>(API.TAG, {});
