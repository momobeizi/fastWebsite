import request from "@/utils/request";

interface Category {
  id: number;
  name: string;
  parentId: number;
  sort: number;
  description: string;
  createTime: string;
}

interface CategoryListResponse {
  total: number;
  list: Category[];
}

// 创建分类
export const createCategoryApi = (data: any) => {
  return request.post("/category/create", data);
};

// 更新分类
export const updateCategoryApi = (data: any) => {
  return request.post("/category/update", data);
};

// 删除分类
export const deleteCategoryApi = (id: number) => {
  return request.delete(`/category/delete/${id}`);
};

// 获取分类详情
export const getCategoryApi = (id: number) => {
  return request.get(`/category/get/${id}`);
};

// 获取分类列表
export const getCategoryListApi = (data: any) => {
  return request.post<CategoryListResponse>("/category/list", data);
};

// 获取分类树
export const getCategoryTreeApi = () => {
  return request.get("/category/tree");
};