import request from "@/utils/request";

interface UserInfo {
  id: string;
  name: string;
}

interface listResponse {
  total: number;
  list: UserInfo[];
}

// 获取用户列表
export const getUserListApi = (data: any) => {
  return request.post<listResponse>("/user/list", data);
};

// 创建用户
export const createUserApi = (data: any) => {
  return request.post<any>("/user/create", data);
};

// 更新用户
export const updateUserApi = (data: any) => {
  return request.post<any>("/user/update", data);
};

// 删除用户
export const deleteUserApi = (id: number | string) => {
  return request.delete<any>(`/user/${id}`, {});
};

// 获取用户详情
export const getUserDetailApi = (id: number | string) => {
  return request.get<any>(`/user/${id}`);
};
