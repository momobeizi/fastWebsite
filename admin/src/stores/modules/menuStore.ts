import { create } from "zustand";
import type { MenuOption } from "@/api/menu";
import { getCurrentUserMenus } from "@/api/menu";
import { persist } from "zustand/middleware";
import { convertMenusToRoutes as convertToRoutes } from "@/routes/utils/generateRoutes";
import type { RouteObject } from "react-router-dom";
import { useAuthStore } from "./authStore";

// 菜单状态类型
interface MenuState {
  // 菜单列表
  menus: MenuOption[];
  
  // 动态路由
  dynamicRoutes: RouteObject[];
  
  // 加载菜单
  loadMenus: () => Promise<void>;
  
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
      
      // 加载菜单
      loadMenus: async () => {
        // 检查是否有 token，没有则不加载
        const token = useAuthStore.getState().token;
        if (!token) {
          console.log('No token, skip loading menus');
          return;
        }
        
        try {
          const res = await getCurrentUserMenus();
          const menuList = res.data ?? [];
          set({ menus: menuList });
          // 转换为路由格式
          const dynamicRoutes = convertToRoutes(menuList);
          set({ dynamicRoutes });
        } catch (error) {
          console.error('Failed to load menus:', error);
        }
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

