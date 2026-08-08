import React, { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { MenuOption } from '@/api/menu';

// 动态导入组件
const lazyImport = (component: string) => {
  // 使用switch语句处理不同组件的导入
  switch (component) {
    case 'Home':
      return lazy(() => import('@/pages/Home'));
    case 'About':
      return lazy(() => import('@/pages/About'));
    case 'Menu':
      return lazy(() => import('@/pages/System/Menu/Index'));
    case 'User':
      return lazy(() => import('@/pages/System/User/Index'));
    case 'Role':
      return lazy(() => import('@/pages/System/Role/Index'));
    case 'OperationLog':
      return lazy(() => import('@/pages/System/Log/OperationLog'));
    case 'LoginLog':
      return lazy(() => import('@/pages/System/Log/LoginLog'));
    case 'WebsiteConfig':
      return lazy(() => import('@/pages/System/Config/WebsiteConfig'));
    case 'Article':
      return lazy(() => import('@/pages/Content/Article/Index'));
    case 'Category':
      return lazy(() => import('@/pages/Content/Category/Index'));
    case 'Tag':
      return lazy(() => import('@/pages/Content/Tag/Index'));
    case 'Carousel':
      return lazy(() => import('@/pages/Content/Carousel/Index'));
    case 'ArticleForm':
      return lazy(() => import('@/pages/Content/Article/ArticleForm'));
    default:
      // 对于未预定义的组件，使用404
      return lazy(() => import('@/pages/System/Error/Page404'));
  }
};

// 处理路由路径，确保正确的路由匹配
const processRoutePath = (path: string): string => {
  if (!path) return '';
  // 移除开头的斜杠，确保作为子路由时路径正确
  return path.startsWith('/') ? path.slice(1) : path;
};

// 提取相对路径
const getRelativePath = (fullPath: string, parentPath: string): string => {
  if (!fullPath) return '';
  if (!parentPath) return processRoutePath(fullPath);
  
  // 移除父路径前缀，得到相对路径
  const relativePath = fullPath.replace(new RegExp(`^${parentPath}`), '');
  return processRoutePath(relativePath);
};

// 将菜单转换为React Router的RouteObject
export const convertMenusToRoutes = (menus: MenuOption[], parentPath: string = ''): RouteObject[] => {
  return menus.map(menu => {
    // 处理路径，确保正确的路由匹配
    const routePath = menu.path === '/' ? '' : getRelativePath(menu.path, parentPath);
    // 处理组件
    let routeElement = undefined;
    // debugger
    if (menu.type && menu.component) {
      const LazyComponent = lazyImport(menu.component);
      routeElement = <LazyComponent />;
    } else if (menu.path === '/') {
      const LazyComponent = lazyImport('Home');
      routeElement = <LazyComponent />;
    }
    
    const route: RouteObject = {
      path: routePath,
      element: routeElement,
      // 转换子菜单
      children: menu.children && menu.children.length > 0 
        ? convertMenusToRoutes(menu.children, menu.path)
        : undefined,
    };
    
    return route;
  });
};

// 过滤掉无效路由
export const filterValidRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.filter(route => {
    // 保留有element或者有children的路由
    const hasValidElement = !!route.element;
    const hasValidChildren = route.children && route.children.length > 0;
    return hasValidElement || hasValidChildren;
  }).map(route => {
    // 递归过滤子路由
    if (route.children && route.children.length > 0) {
      return {
        ...route,
        children: filterValidRoutes(route.children),
      };
    }
    return route;
  });
};