import { ResponseData } from "../type";

export type ResponseCheckSystemInit = ResponseData<CheckSystemInitData>
export type ResponseLogin = ResponseData<User>


type CheckSystemInitData = {
  initialized: boolean;
};



export type User = {
  id?: string;
  username?: string;
  email?: string;
  role: {
    _id: string;
    name: "superAdmin" | "webMaster" | "user";
    permissions: string[];
  };
  password?: string;
  imgurl?: string;
  oldPassword?: string;
  newPassword?: string;
};
