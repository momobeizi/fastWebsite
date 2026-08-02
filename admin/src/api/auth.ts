import request from '../utils/request';
import type { UserInfoInterface } from '@/types';

// 登录参数类型
interface LoginParams {
  username: string;
  password: string;
  captcha: string;
}

// 登录返回类型
interface LoginResponse {
  token: string;
  userInfo: UserInfoInterface;
}

// 认证相关API
export const authApi = {
  // 获取验证码
  getCaptcha: async () => {
    const response = await request.get('/auth/captcha');
    // 直接返回response，因为我们的拦截器已经处理了响应
    return response;
  },

  // 登录
  login: async (params: LoginParams) => {
    const response = await request.post('/auth/login', params);
    // 直接返回response，因为我们的拦截器已经处理了响应
    return response;
  },

  // 获取用户信息
  getUserInfo: async () => {
    const response = await request.get('/auth/info');
    // 直接返回response，因为我们的拦截器已经处理了响应
    return response;
  },

  // 退出登录
  logout: async () => {
    const response = await request.post('/auth/logout');
    // 直接返回response，因为我们的拦截器已经处理了响应
    return response;
  },
};