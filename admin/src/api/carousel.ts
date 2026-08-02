import request from "@/utils/request";

interface Carousel {
  id: number;
  image: string;
  title: string;
  link: string;
  sort: number;
  status: string;
  createTime: string;
}

interface CarouselListResponse {
  total: number;
  list: Carousel[];
}

// 创建轮播图
export const createCarouselApi = (data: any) => {
  return request.post("/carousel/create", data);
};

// 更新轮播图
export const updateCarouselApi = (data: any) => {
  return request.post("/carousel/update", data);
};

// 删除轮播图
export const deleteCarouselApi = (id: number) => {
  return request.delete(`/carousel/delete/${id}`);
};

// 获取轮播图详情
export const getCarouselApi = (id: number) => {
  return request.get(`/carousel/get/${id}`);
};

// 获取轮播图列表
export const getCarouselListApi = (data: any) => {
  return request.post<CarouselListResponse>("/carousel/list", data);
};

// 更新轮播图状态
export const updateCarouselStatusApi = (id: number, status: string) => {
  return request.post(`/carousel/updateStatus/${id}`, { status });
};