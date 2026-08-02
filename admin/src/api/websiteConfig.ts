import request from '@/utils/request';

// 更新网站配置
export const updateWebsiteConfig = (data: any) => {
  return request({
    url: '/api/websiteConfig/update',
    method: 'post',
    data,
  });
};

// 获取网站配置
export const getWebsiteConfig = () => {
  return request({
    url: '/api/websiteConfig/get',
    method: 'get',
  });
};

// 获取网站配置列表
export const listWebsiteConfigs = (data: any) => {
  return request({
    url: '/api/websiteConfig/list',
    method: 'post',
    data,
  });
};