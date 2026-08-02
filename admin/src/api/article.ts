import request from "@/utils/request";

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  categoryId: string;
  tags: string;
  author: string;
  status: string;
  readCount: number;
  sort: number;
  isTop: number;
  createTime: string;
}

interface ArticleListResponse {
  total: number;
  list: Article[];
}

// 创建文章
export const createArticleApi = (data: any) => {
  return request.post("/article/create", data);
};

// 更新文章
export const updateArticleApi = (data: any) => {
  return request.post("/article/update", data);
};

// 删除文章
export const deleteArticleApi = (id: string) => {
  return request.delete(`/article/delete/${id}`);
};

// 获取文章详情
export const getArticleApi = (id: string) => {
  return request.get(`/article/get/${id}`);
};

// 获取文章列表
export const getArticleListApi = (data: any) => {
  return request.post<ArticleListResponse>("/article/list", data);
};

// 发布文章
export const publishArticleApi = (id: string) => {
  return request.post(`/article/publish/${id}`);
};

// 撤回文章
export const withdrawArticleApi = (id: string) => {
  return request.post(`/article/withdraw/${id}`);
};