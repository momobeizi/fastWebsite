import request from "@/utils/request";

// ========== 网站配置 ==========
export const getWebsiteConfigApi = () => request.get("/website/config");
export const saveWebsiteConfigApi = (data: any) => request.post("/website/config", data);

// ========== Banner ==========
export const getBannerListApi = (params?: any) => request.get("/website/banner/list", { params });
export const addBannerApi = (data: any) => request.post("/website/banner/add", data);
export const updateBannerApi = (data: any) => request.post("/website/banner/update", data);
export const deleteBannerApi = (id: number) => request.get(`/website/banner/delete/${id}`);

// ========== 导航 ==========
export const getNavListApi = () => request.get("/website/nav/list");
export const saveNavListApi = (data: any[]) => request.post("/website/nav/save", data);

// ========== 文章分类 ==========
export const getArticleCategoryListApi = (params?: any) => request.get("/website/article/category/list", { params });
export const addArticleCategoryApi = (data: any) => request.post("/website/article/category/add", data);
export const updateArticleCategoryApi = (data: any) => request.post("/website/article/category/update", data);
export const deleteArticleCategoryApi = (id: number) => request.get(`/website/article/category/delete/${id}`);

// ========== 文章 ==========
export const getArticleListApi = (params?: any) => request.get("/website/article/list", { params });
export const getArticleApi = (id: number) => request.get(`/website/article/info/${id}`);
export const addArticleApi = (data: any) => request.post("/website/article/add", data);
export const updateArticleApi = (data: any) => request.post("/website/article/update", data);
export const deleteArticleApi = (id: number) => request.get(`/website/article/delete/${id}`);

// ========== 产品分类 ==========
export const getProductCategoryListApi = (params?: any) => request.get("/website/product/category/list", { params });
export const addProductCategoryApi = (data: any) => request.post("/website/product/category/add", data);
export const updateProductCategoryApi = (data: any) => request.post("/website/product/category/update", data);
export const deleteProductCategoryApi = (id: number) => request.get(`/website/product/category/delete/${id}`);

// ========== 产品 ==========
export const getProductListApi = (params?: any) => request.get("/website/product/list", { params });
export const getProductApi = (id: number) => request.get(`/website/product/info/${id}`);
export const addProductApi = (data: any) => request.post("/website/product/add", data);
export const updateProductApi = (data: any) => request.post("/website/product/update", data);
export const deleteProductApi = (id: number) => request.get(`/website/product/delete/${id}`);

// ========== 单页面 ==========
export const getPageListApi = (params?: any) => request.get("/website/page/list", { params });
export const getPageApi = (id: number) => request.get(`/website/page/info/${id}`);
export const addPageApi = (data: any) => request.post("/website/page/add", data);
export const updatePageApi = (data: any) => request.post("/website/page/update", data);
export const deletePageApi = (id: number) => request.get(`/website/page/delete/${id}`);
