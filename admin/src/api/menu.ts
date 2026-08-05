import request from '@/utils/request';

// 菜单选项类型
export interface MenuOption {
  id: number;
  name: string;
  type?: number;
  path: string;
  component?: string;
  icon?: string;
  parentId: number;
  sort?: number;
  status?: number;
  permission?: string;
  visible?: number;
  keepAlive?: number;
  isRoute?: number;
  children?: MenuOption[];
  meta?: {
    title: string;
    icon?: string;
    permission?: string;
    visible?: boolean;
    keepAlive?: boolean;
  };
}

// 后端统一响应结构
interface ApiResult<T> {
  code: number;
  msg: string;
  data: T;
}

// 获取当前用户的菜单列表
export const getCurrentUserMenus = (): Promise<ApiResult<MenuOption[]>> => {
  return request.get('/menu/current');
};

// 获取所有菜单（平铺列表，前端自行构建树）
export const getAllMenus = (): Promise<ApiResult<MenuOption[]>> => {
  return request.get('/menu/all');
};

// 新增菜单
export const addMenu = (menu: Partial<MenuOption>): Promise<ApiResult<boolean>> => {
  return request.post('/menu/add', menu);
};

// 更新菜单
export const updateMenu = (menu: Partial<MenuOption>): Promise<ApiResult<boolean>> => {
  return request.put('/menu/update', menu);
};

// 删除菜单
export const deleteMenu = (id: number): Promise<ApiResult<boolean>> => {
  return request.delete(`/menu/delete/${id}`);
};

// 获取菜单详情
export const getMenuById = (id: number): Promise<ApiResult<MenuOption>> => {
  return request.get(`/menu/get/${id}`);
};
