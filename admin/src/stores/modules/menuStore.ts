import { create } from "zustand";
import type { MenuOption } from "@/api/menu";
import { persist } from "zustand/middleware";
import { convertMenusToRoutes as convertToRoutes } from "@/routes/utils/generateRoutes";
import type { RouteObject } from "react-router-dom";
import { useAuthStore } from "./authStore";
import { getCurrentUserMenus } from "@/api/menu";

// 硬编码的静态菜单数据（不再从后端接口获取）
const staticMenus: MenuOption[] = [
  {
    id: 1,
    name: '首页',
    path: '/home',
    component: 'Home',
    icon: 'HomeOutlined',
    parentId: 0,
    sort: 1,
    isRoute: 1,
    visible: 1,
    status: 1,
  },
  {
    id: 2,
    name: '系统管理',
    path: '/system',
    icon: 'SettingOutlined',
    parentId: 0,
    sort: 2,
    isRoute: 0,
    visible: 1,
    status: 1,
    children: [
      {
        id: 3,
        name: '菜单管理',
        path: '/system/menu',
        component: 'Menu',
        icon: 'MenuOutlined',
        parentId: 2,
        sort: 1,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
      {
        id: 4,
        name: '用户管理',
        path: '/system/user',
        component: 'User',
        icon: 'UserOutlined',
        parentId: 2,
        sort: 2,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
      {
        id: 5,
        name: '角色管理',
        path: '/system/role',
        component: 'Role',
        icon: 'TeamOutlined',
        parentId: 2,
        sort: 3,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
      {
        id: 6,
        name: '操作日志',
        path: '/system/log/operation',
        component: 'OperationLog',
        icon: 'FileTextOutlined',
        parentId: 2,
        sort: 4,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
      {
        id: 7,
        name: '登录日志',
        path: '/system/log/login',
        component: 'LoginLog',
        icon: 'FileOutlined',
        parentId: 2,
        sort: 5,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
    ],
  },
  {
    id: 8,
    name: '内容管理',
    path: '/content',
    icon: 'FileTextOutlined',
    parentId: 0,
    sort: 3,
    isRoute: 0,
    visible: 1,
    status: 1,
    children: [
      {
        id: 9,
        name: '文章管理',
        path: '/content/article',
        component: 'Article',
        icon: 'FileTextOutlined',
        parentId: 8,
        sort: 1,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
      {
        id: 10,
        name: '分类管理',
        path: '/content/category',
        component: 'Category',
        icon: 'MenuOutlined',
        parentId: 8,
        sort: 2,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
      {
        id: 11,
        name: '标签管理',
        path: '/content/tag',
        component: 'Tag',
        icon: 'MenuOutlined',
        parentId: 8,
        sort: 3,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
      {
        id: 12,
        name: '轮播图管理',
        path: '/content/carousel',
        component: 'Carousel',
        icon: 'MenuOutlined',
        parentId: 8,
        sort: 4,
        isRoute: 1,
        visible: 1,
        status: 1,
      },
    ],
  },
  {
    id: 13,
    name: '关于',
    path: '/about',
    component: 'About',
    icon: 'InfoCircleOutlined',
    parentId: 0,
    sort: 4,
    isRoute: 1,
    visible: 1,
    status: 1,
  },
];

// 菜单状态类型
interface MenuState {
  // 菜单列表
  menus: MenuOption[];
  
  // 动态路由
  dynamicRoutes: RouteObject[];
  
  // 加载菜单
  loadMenus: () => void;
  
  // 更新菜单
  updateMenus: (menus: MenuOption[]) => void;
  
  // 清空菜单
  clearMenus: () => void;
  
  // 设置动态路由
  setDynamicRoutes: (routes: MenuOption[]) => void;
}

// 创建菜单状态管理
export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      // 初始状态
      menus: [],
      dynamicRoutes: [],
      
      // 加载菜单（使用硬编码静态数据，不再请求后端接口）
      loadMenus:  async () => {
        // 检查是否有 token，没有则不加载
        const token = useAuthStore.getState().token;
        if (!token) {
          console.log('No token, skip loading menus');
          return;
        }
        
        // ===== 原后端接口逻辑（已注释） =====
        try {
          const res = await getCurrentUserMenus();
          const menuList = res.data ?? [];
          set({ menus: menuList });
          const dynamicRoutes = convertToRoutes(menuList);
          console.log('dynamicRoutes', dynamicRoutes);
          set({ dynamicRoutes });
        } catch (error) {
          console.error('Failed to load menus:', error);
        }
        
        // 使用静态菜单数据
        // const menuList = staticMenus;
        // set({ menus: menuList });
        // const dynamicRoutes = convertToRoutes(menuList);
        // set({ dynamicRoutes });
      },
      
      // 更新菜单
      updateMenus: (menus: MenuOption[]) => {
        set({ menus });
        // 转换为路由格式
        const dynamicRoutes = convertToRoutes(menus);
        set({ dynamicRoutes });
      },
      
      // 清空菜单
      clearMenus: () => {
        set({ menus: [], dynamicRoutes: [] });
      },
      
      // 设置动态路由
      setDynamicRoutes: (routes: MenuOption[]) => {
        set({ dynamicRoutes: routes as RouteObject[] });
      },
    }),
    {
      // 持久化配置
      name: "menu-storage",
      // 只持久化menus和dynamicRoutes
      partialize: (state) => ({
        menus: state.menus,
        dynamicRoutes: state.dynamicRoutes,
      }),
    }
  )
);

