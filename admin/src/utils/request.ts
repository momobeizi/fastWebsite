import axios from "axios";
import { message } from "antd";
import { useAuthStore } from "@/stores";

const request = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data.code === 0 || data.code === 200) {
      return data;
    } else {
      switch (data.code) {
        case 401:
          message.error("登录已过期，请重新登录");
          useAuthStore.getState().logout();
          window.location.href = "/login";
          break;
        case 403:
          message.error("没有权限访问该资源");
          break;
        case 404:
          message.error("请求的资源不存在");
          break;
        case 500:
          message.error(data.message || "服务器内部错误");
          break;
        default:
          message.error(data.message || "请求失败");
      }
      return Promise.reject(new Error(data.message || "请求失败"));
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error("登录已过期，请重新登录");
          useAuthStore.getState().logout();
          window.location.href = "/login";
          break;
        case 403:
          message.error("没有权限访问该资源");
          break;
        case 404:
          message.error("请求的资源不存在");
          break;
        case 500:
          message.error("服务器内部错误");
          break;
        default:
          message.error(error.response.data.message);
          // message.error(`请求失败，状态码：${error.response.status}`);
      }
    } else if (error.request) {
      message.error("网络错误，无法连接服务器");
    } else {
      message.error("请求配置错误");
    }
    return Promise.reject(error);
  }
);

export default request;
