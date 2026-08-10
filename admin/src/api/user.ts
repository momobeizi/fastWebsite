import request from "@/utils/request";

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  role: string;
  status: number;
  loginTime?: string;
  loginIp?: string;
  createTime: string;
  updateTime: string;
}

// 获取用户列表（nestjs-paginate 格式：扁平 query 参数）
export const getUserListApi = (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}) => {
  return request.get("/user/list", { params });
};

// 创建用户
export const createUserApi = (data: any) => {
  return request.post("/user/add", data);
};

// 更新用户
export const updateUserApi = (data: any) => {
  return request.post("/user/update", data);
};

// 删除用户
export const deleteUserApi = (id: number) => {
  return request.get(`/user/delete/${id}`);
};

// 获取用户详情
export const getUserDetailApi = (id: number) => {
  return request.get(`/user/info/${id}`);
};
