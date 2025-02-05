export interface Role {
  _id: string;
  name: "superAdmin" | "webMaster" | "user";
  permissions: string[];
} 