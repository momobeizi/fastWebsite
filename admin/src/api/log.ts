import request from "@/utils/request";

// 获取请求日志列表
export const getRequestLogListApi = (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}) => {
  return request.get("/log/list", { params });
};

// 删除单条日志
export const deleteRequestLogApi = (id: number) => {
  return request.get(`/log/delete/${id}`);
};

// 清空所有日志
export const clearRequestLogsApi = () => {
  return request.post("/log/clear");
};
