import http from "../index";
import { ResponseData } from "../type";
import { Verification, VerificationListResult } from "./types";

enum API {
  VERIFICATION_REVIEW = "/verification/review",
  VERIFICATION_LIST = "/verification/list"
}

// 管理员审核认证申请
export const reviewVerification = (data: {
  verificationId: string;
  approved: boolean;
  rejectReason?: string;
}) => {
  return http.post<any, ResponseData<Verification>>(API.VERIFICATION_REVIEW, data);
};

// 获取认证申请列表
export const getVerificationList = (params: {
  page?: string;
  limit?: string;
  status?: string;
  type?: string;
}) => {
  return http.get<any, ResponseData<VerificationListResult>>(API.VERIFICATION_LIST, {
    params,
  });
}; 