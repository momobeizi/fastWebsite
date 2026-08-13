import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { MenuOption } from '@/api/menu';

// 组件名到路径的映射
const componentMap: Record<string, string> = {
  'Home': '@/pages/Home',
  'About': '@/pages/About',
  'Menu': '@/pages/System/Menu/Index',
  'User': '@/pages/System/User/Index',
  'Role': '@/pages/System/Role/Index',
  'OperationLog': '@/pages/System/Log/OperationLog',
  'LoginLog': '@/pages/System/Log/LoginLog',
  'WebsiteConfig': '@/pages/System/Config/WebsiteConfig',
  'Article': '@/pages/Content/Article/Index',
  'Category': '@/pages/Content/Category/Index',
  'Tag': '@/pages/Content/Tag/Index',
  'Carousel': '@/pages/Content/Carousel/Index',
  'ArticleForm': '@/pages/Content/Article/ArticleForm',
  'RequestLog': '@/pages/System/Log/RequestLog',
  'DictType': '@/pages/System/Dict/DictType',
  'DictData': '@/pages/System/Dict/DictData',
  'WebsiteConfig': '@/pages/Website/Config',
  'WebsiteBanner': '@/pages/Website/Banner',
  'WebsiteNav': '@/pages/Website/Nav',
  'WebsiteArticleCategory': '@/pages/Website/ArticleCategory',
  'WebsiteArticle': '@/pages/Website/Article',
  'WebsiteProductCategory': '@/pages/Website/ProductCategory',
  'WebsiteProduct': '@/pages/Website/Product',
  'WebsitePage': '@/pages/Website/Page',
};

// 动态导入组件
const lazyImport = (component: string) => {
  // 先从映射表找
  if (componentMap[component]) {
    component = componentMap[component];
  }

  // 使用switch语句处理不同组件的导入
  switch (component) {
    case '@/pages/Home':
      return lazy(() => import('@/pages/Home'));
    case '@/pages/About':
      return lazy(() => import('@/pages/About'));
    case '@/pages/System/Menu/Index':
      return lazy(() => import('@/pages/System/Menu/Index'));
    case '@/pages/System/User/Index':
      return lazy(() => import('@/pages/System/User/Index'));
    case '@/pages/System/Role/Index':
      return lazy(() => import('@/pages/System/Role/Index'));
    case '@/pages/System/Log/OperationLog':
      return lazy(() => import('@/pages/System/Log/OperationLog'));
    case '@/pages/System/Log/LoginLog':
      return lazy(() => import('@/pages/System/Log/LoginLog'));
    case '@/pages/System/Config/WebsiteConfig':
      return lazy(() => import('@/pages/System/Config/WebsiteConfig'));
    case '@/pages/Content/Article/Index':
      return lazy(() => import('@/pages/Content/Article/Index'));
    case '@/pages/Content/Category/Index':
      return lazy(() => import('@/pages/Content/Category/Index'));
    case '@/pages/Content/Tag/Index':
      return lazy(() => import('@/pages/Content/Tag/Index'));
    case '@/pages/Content/Carousel/Index':
      return lazy(() => import('@/pages/Content/Carousel/Index'));
    case '@/pages/Content/Article/ArticleForm':
      return lazy(() => import('@/pages/Content/Article/ArticleForm'));
    case '@/pages/System/Log/RequestLog':
      return lazy(() => import('@/pages/System/Log/RequestLog'));
    case '@/pages/System/Dict/DictType':
      return lazy(() => import('@/pages/System/Dict/DictType'));
    case '@/pages/System/Dict/DictData':
      return lazy(() => import('@/pages/System/Dict/DictData'));
    case '@/pages/Website/Config':
      return lazy(() => import('@/pages/Website/Config'));
    case '@/pages/Website/Banner':
      return lazy(() => import('@/pages/Website/Banner'));
    case '@/pages/Website/Nav':
      return lazy(() => import('@/pages/Website/Nav'));
    case '@/pages/Website/ArticleCategory':
      return lazy(() => import('@/pages/Website/ArticleCategory'));
    case '@/pages/Website/Article':
      return lazy(() => import('@/pages/Website/Article'));
    case '@/pages/Website/ProductCategory':
      return lazy(() => import('@/pages/Website/ProductCategory'));
    case '@/pages/Website/Product':
      return lazy(() => import('@/pages/Website/Product'));
    case '@/pages/Website/Page':
      return lazy(() => import('@/pages/Website/Page'));
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
    if (menu.component) {
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