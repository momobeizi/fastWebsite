import { Navigate, type RouteObject } from "react-router-dom";
import { ErrorRoutes } from "./ErrorRoutes";
import { basicRoutes, mainLayoutRoute } from "./MainRoutes";
import { useMenuStore } from "@/stores/modules/menuStore";
import { convertMenusToRoutes, filterValidRoutes } from "../utils/generateRoutes.tsx";

// 获取基础路由
export const getBasicRoutes = (): RouteObject[] => {
    return [
        ...basicRoutes,
        ...ErrorRoutes,
        { path: "*", element: <Navigate to="/404" replace /> },
    ];
};

// 获取完整路由（基础路由 + 动态路由）
export const getCompleteRoutes = (menus: MenuOption[]) => {
    // 过滤掉根路径的菜单，只处理子菜单
    const nonRootMenus = menus.filter(menu => menu.path !== '/');
    
    // 将菜单转换为路由
    const dynamicRoutes = convertMenusToRoutes(nonRootMenus);
    
    // 过滤有效路由
    const validDynamicRoutes = filterValidRoutes(dynamicRoutes);
    
    // 合并到主布局路由的children中
    const updatedMainLayoutRoute = {
        ...mainLayoutRoute,
        children: [
            // 保留原有的children
            ...(mainLayoutRoute.children || []),
            // 添加动态路由
            ...validDynamicRoutes,
        ],
    };
    // 合并所有路由
    return [
        ...basicRoutes,
        updatedMainLayoutRoute,
        ...ErrorRoutes,
        { path: "*", element: <Navigate to="/404" replace /> },
    ];
};

// 默认导出基础路由
export const routes: RouteObject[] = getBasicRoutes();
