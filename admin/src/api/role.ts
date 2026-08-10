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
  return request.post("/role/add", data);
};

// 更新角色
export const updateRoleApi = (data: any) => {
  return request.post("/role/update", data);
};

// 删除角色
export const deleteRoleApi = (id: number) => {
  return request.get(`/role/delete/${id}`);
};

// 获取角色详情
export const getRoleApi = (id: number) => {
  return request.get(`/role/info/${id}`);
};

// 获取角色列表（nestjs-paginate 格式：扁平 query 参数）
export const getRoleListApi = (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}) => {
  return request.get<RoleListResponse>("/role/list", { params });
};

// 获取所有角色
export const getAllRolesApi = () => {
  return request.get("/role/all");
};