import request from "@/utils/request";

interface Tag {
  id: number;
  name: string;
  description: string;
  createTime: string;
}

interface TagListResponse {
  total: number;
  list: Tag[];
}

// 创建标签
export const createTagApi = (data: any) => {
  return request.post("/tag/create", data);
};

// 更新标签
export const updateTagApi = (data: any) => {
  return request.post("/tag/update", data);
};

// 删除标签
export const deleteTagApi = (id: number) => {
  return request.delete(`/tag/delete/${id}`);
};

// 获取标签详情
export const getTagApi = (id: number) => {
  return request.get(`/tag/get/${id}`);
};

// 获取标签列表
export const getTagListApi = (data: any) => {
  return request.post<TagListResponse>("/tag/list", data);
};