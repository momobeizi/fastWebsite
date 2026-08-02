import request from '@/utils/request';

export interface LoginLogListParam {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export interface LoginLogListResp {
  id: number;
  username: string;
  nickname: string;
  ip: string;
  device: string;
  os: string;
  browser: string;
  status: string;
  failReason: string;
  createTime: string;
}

export interface PageResp<T> {
  total: number;
  list: T[];
}

// 登录日志列表
export function loginLogListApi(params: LoginLogListParam) {
  return request.post<PageResp<LoginLogListResp>>('/loginLog/list', params);
}

// 清理登录日志
export function loginLogCleanApi(startTime: string, endTime: string) {
  return request.post('/loginLog/clean', null, {
    params: { startTime, endTime },
  });
}
