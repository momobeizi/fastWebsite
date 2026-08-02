import request from "@/utils/request";

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string;
  createTime: string;
}

interface RoleListResponse {
  total: number;
  list: Role[];
}

// 创建角色
export const createRoleApi = (data: any) => {
  return request.post("/role/create", data);
};

// 更新角色
export const updateRoleApi = (data: any) => {
  return request.post("/role/update", data);
};

// 删除角色
export const deleteRoleApi = (id: number) => {
  return request.delete(`/role/delete/${id}`);
};

// 获取角色详情
export const getRoleApi = (id: number) => {
  return request.get(`/role/get/${id}`);
};

// 获取角色列表
export const getRoleListApi = (data: any) => {
  return request.post<RoleListResponse>("/role/list", data);
};

// 获取所有角色
export const getAllRolesApi = () => {
  return request.get("/role/all");
};