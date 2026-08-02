/*
 * 用户信息类型
 */
export interface UserInfoInterface {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  photo: string;
}