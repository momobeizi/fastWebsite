import { Outlet, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";

// 懒加载组件
const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const ArticleForm = lazy(() => import("@/pages/Content/Article/ArticleForm"));
const SystemMonitor = lazy(() => import("@/pages/System/Monitor/Index"));

// 基础路由配置
export const basicRoutes: RouteObject[] = [
    // 登录路由（不需要布局）
    {
        path: "/login",
        element: (
            <Suspense fallback={<div>页面加载中...</div>}>
                <Login />
            </Suspense>
        ),
    },
];

// 主布局路由
export const mainLayoutRoute: RouteObject = {
    path: "/",
    element: (
        <ProtectedRoute>
            <MainLayout>
                <Suspense fallback={<div>页面加载中...</div>}>
                    <Outlet />
                </Suspense>
            </MainLayout>
        </ProtectedRoute>
    ),
    children: [
        // 首页
        {
            path: "",
            element: <Home />,
        },
        // 关于页面
        {
            path: "about",
            element: <About />,
        },
        // 文章管理 - 新增和编辑页面
        {
            path: "content/article/create",
            element: <ArticleForm />,
        },
        {
            path: "content/article/edit/:id",
            element: <ArticleForm />,
        },
        // 系统监控页面
        {
            path: "system/monitor",
            element: <SystemMonitor />,
        },
    ],
};

// 默认导出
export const MainRoutes: RouteObject[] = [
    ...basicRoutes,
    mainLayoutRoute,
];
