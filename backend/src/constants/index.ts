// src/constants/index.ts
// bcrypt 加密盐值
export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// redis key 前缀（区分不同项目）
const PREFIX = 'website:';

// redis key 定义
export const RedisKey = {
  captcha: (uuid: string) => `${PREFIX}:auth:captcha:${uuid}`,
  token: (userId: number) => `${PREFIX}:auth:token:${userId}`,
  loginUserInfo: (token: string) => `${PREFIX}:auth:loginUserInfo:${token}`,
  dictData: (code: string) => `${PREFIX}:dict:data:${code}`,
} as const;