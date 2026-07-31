// src/common/helpers/response.helper.ts
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export function success<T>(data: T, message = 'success'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data,
  };
}

export function fail(message: string, code = 400): ApiResponse<null> {
  return {
    code,
    message,
    data: null,
  };
}
