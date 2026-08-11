import request from "@/utils/request";

// ========== 字典类型 ==========

// 获取字典类型列表
export const getDictTypeListApi = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return request.get("/dict/type/list", { params });
};

// 新增字典类型
export const addDictTypeApi = (data: any) => {
  return request.post("/dict/type/add", data);
};

// 更新字典类型
export const updateDictTypeApi = (data: any) => {
  return request.post("/dict/type/update", data);
};

// 删除字典类型
export const deleteDictTypeApi = (id: number) => {
  return request.get(`/dict/type/delete/${id}`);
};

// ========== 字典数据 ==========

// 获取字典数据列表
export const getDictDataListApi = (params: {
  page?: number;
  limit?: number;
  search?: string;
  filter?: Record<string, any>;
}) => {
  return request.get("/dict/data/list", { params });
};

// 根据编码获取字典数据（下拉框用）
export const getDictDataByCodeApi = (code: string) => {
  return request.get(`/dict/data/code/${code}`);
};

// 新增字典数据
export const addDictDataApi = (data: any) => {
  return request.post("/dict/data/add", data);
};

// 更新字典数据
export const updateDictDataApi = (data: any) => {
  return request.post("/dict/data/update", data);
};

// 删除字典数据
export const deleteDictDataApi = (id: number) => {
  return request.get(`/dict/data/delete/${id}`);
};
