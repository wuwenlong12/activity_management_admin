import { ResponseData } from "../type";

export type ResponseGetTag = ResponseData<Tag[]>
export type Tag = {
  _id?: string;
  name?: string;
};
