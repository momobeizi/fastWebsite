import request from '@/utils/request';

// 获取操作日志列表
export const listOperationLogs = (data: any) => {
  return request({
    url: '/api/operationLog/list',
    method: 'post',
    data,
  });
};

// 清理操作日志
export const cleanOperationLogs = (startTime: string, endTime: string) => {
  return request({
    url: '/api/operationLog/clean',
    method: 'post',
    params: { startTime, endTime },
  });
};